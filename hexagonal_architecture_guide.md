# Arquitetura Hexagonal: Guia Completo

## Índice
- [Visão Geral](#visão-geral)
- [Estrutura de Camadas](#estrutura-de-camadas)
- [Domain Layer](#domain-layer)
- [Application Layer](#application-layer)
- [Infrastructure Layer](#infrastructure-layer)
- [Ports e Adapters](#ports-e-adapters)
- [Fluxo de Dados](#fluxo-de-dados)
- [Terminologias e Convenções](#terminologias-e-convenções)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Exemplo Prático](#exemplo-prático)
- [Boas Práticas](#boas-práticas)

---

## Visão Geral

A **Arquitetura Hexagonal** (Ports and Adapters) é um padrão arquitetural que isola a lógica de negócio das preocupações técnicas, promovendo alta testabilidade, flexibilidade e manutenibilidade.

### Princípios Fundamentais

1. **Inversão de Dependência**: Domain define contratos (ports) que Infrastructure implementa (adapters)
2. **Isolamento do Domain**: Lógica de negócio independente de frameworks e tecnologias
3. **Testabilidade**: Fácil criação de mocks e testes unitários
4. **Flexibilidade**: Troca de implementações sem impactar o negócio

### Conceito Visual

```
┌─────────────────────────────────────────┐
│           INFRASTRUCTURE                │
│  ┌─────────────────────────────────┐    │
│  │         APPLICATION             │    │
│  │  ┌─────────────────────────┐    │    │
│  │  │        DOMAIN           │    │    │
│  │  │    ┌─────────────┐      │    │    │
│  │  │    │  Entities   │      │    │    │
│  │  │    │   & Value   │      │    │    │
│  │  │    │   Objects   │      │    │    │
│  │  │    └─────────────┘      │    │    │
│  │  │                         │    │    │
│  │  │    ┌─────────────┐      │    │    │
│  │  │    │ Use Cases   │      │    │    │
│  │  │    └─────────────┘      │    │    │
│  │  └─────────────────────────┘    │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

---

## Estrutura de Camadas

### 1. Domain Layer (Núcleo)
**Responsabilidade**: Regras de negócio puras e entidades

**Características**:
- Não possui dependências externas
- Contém apenas lógica de domínio
- Define ports (interfaces) para comunicação externa

### 2. Application Layer (Orquestração)
**Responsabilidade**: Casos de uso e services cross-cutting

**Características**:
- Orquestra operações de negócio
- Implementa casos de uso específicos
- Contém services que não pertencem a entidades

### 3. Infrastructure Layer (Detalhes Técnicos)
**Responsabilidade**: Implementações concretas e integrações

**Características**:
- Adapters que implementam ports
- Configurações e dependências
- Frameworks e bibliotecas externas

---

## Domain Layer

### Entities
**Definição**: Objetos com identidade única e lógica de negócio encapsulada.

```python
@dataclass
class DataAsset:
    id: DataAssetId
    qualified_name: QualifiedName
    name: str
    asset_type: AssetType
    description: Optional[str]
    owner: Optional[OwnerId]
    quality_score: QualityScore
    tags: List[Tag]
    created_at: datetime
    updated_at: Optional[datetime]
    
    @classmethod
    def create(cls, qualified_name: str, name: str, asset_type: AssetType) -> 'DataAsset':
        return cls(
            id=DataAssetId.generate(),
            qualified_name=QualifiedName(qualified_name),
            name=name,
            asset_type=asset_type,
            description=None,
            owner=None,
            quality_score=QualityScore.unknown(),
            tags=[],
            created_at=datetime.utcnow(),
            updated_at=None
        )
    
    def update_quality(self, score: QualityScore) -> None:
        if score.value < 0 or score.value > 100:
            raise InvalidQualityScoreError(score)
        
        self.quality_score = score
        self.updated_at = datetime.utcnow()
    
    def add_tag(self, tag: Tag) -> None:
        if tag not in self.tags:
            self.tags.append(tag)
            self.updated_at = datetime.utcnow()
```

### Value Objects
**Definição**: Objetos imutáveis definidos por seus valores, não por identidade.

```python
@dataclass(frozen=True)
class QualifiedName:
    value: str
    
    def __post_init__(self):
        if not self._is_valid(self.value):
            raise ValueError("Invalid qualified name format")
    
    def _is_valid(self, name: str) -> bool:
        # Ex: "database.schema.table" ou "s3://bucket/path/file"
        return len(name) > 0 and not name.startswith('.') and not name.endswith('.')

@dataclass(frozen=True)
class QualityScore:
    value: float
    calculated_at: datetime
    
    @classmethod
    def unknown(cls) -> 'QualityScore':
        return cls(value=-1.0, calculated_at=datetime.utcnow())
    
    @classmethod
    def calculate(cls, completeness: float, accuracy: float) -> 'QualityScore':
        # Simplified quality calculation
        score = (completeness * 0.6) + (accuracy * 0.4)
        return cls(value=round(score, 2), calculated_at=datetime.utcnow())

@dataclass(frozen=True)
class Tag:
    name: str
    category: TagCategory = TagCategory.GENERAL
    
    def __post_init__(self):
        if not self.name or len(self.name.strip()) == 0:
            raise ValueError("Tag name cannot be empty")
```

### Domain Events
**Definição**: Eventos que representam algo importante que aconteceu no domínio.

```python
@dataclass(frozen=True)
class DataAssetRegisteredEvent:
    asset_id: DataAssetId
    qualified_name: QualifiedName
    asset_type: AssetType
    occurred_at: datetime

@dataclass(frozen=True)
class DataQualityUpdatedEvent:
    asset_id: DataAssetId
    old_score: QualityScore
    new_score: QualityScore
    occurred_at: datetime
```

---

## Application Layer

### Use Cases
**Definição**: Implementações específicas de casos de uso do sistema.

```python
# application/use_cases/register_data_asset_use_case.py
class RegisterDataAssetUseCase:
    def __init__(
        self,
        asset_repository: DataAssetRepository,
        event_publisher: EventPublisher
    ):
        self._asset_repository = asset_repository
        self._event_publisher = event_publisher
    
    def execute(self, command: RegisterDataAssetCommand) -> DataAssetId:
        # Validar se asset já existe
        existing_asset = self._asset_repository.find_by_qualified_name(
            QualifiedName(command.qualified_name)
        )
        if existing_asset:
            raise AssetAlreadyExistsError(command.qualified_name)
        
        # Criar asset
        asset = DataAsset.create(
            qualified_name=command.qualified_name,
            name=command.name,
            asset_type=command.asset_type
        )
        
        if command.description:
            asset.description = command.description
        
        if command.owner:
            asset.owner = command.owner
        
        # Adicionar tags
        for tag_name in command.tags:
            tag = Tag(name=tag_name)
            asset.add_tag(tag)
        
        # Persistir
        self._asset_repository.save(asset)
        
        # Publicar evento
        event = DataAssetRegisteredEvent(
            asset_id=asset.id,
            qualified_name=asset.qualified_name,
            asset_type=asset.asset_type,
            occurred_at=datetime.utcnow()
        )
        self._event_publisher.publish(event)
        
        return asset.id

# application/use_cases/search_data_assets_use_case.py
class SearchDataAssetsUseCase:
    def __init__(
        self,
        search_repository: DataAssetSearchRepository
    ):
        self._search_repository = search_repository
    
    def execute(self, query: SearchDataAssetsQuery) -> SearchResult:
        # Construir critérios de busca
        criteria = SearchCriteria(
            query_text=query.query_text,
            asset_types=query.asset_types,
            tags=query.tags,
            owner=query.owner,
            limit=query.limit,
            offset=query.offset
        )
        
        # Executar busca
        search_results = self._search_repository.search(criteria)
        
        return SearchResult(
            assets=search_results.assets,
            total_count=search_results.total_count,
            query_time_ms=search_results.query_time_ms
        )
```

### Commands e Queries
**Definição**: Objetos que representam intenções de modificação (Commands) ou consulta (Queries).

```python
@dataclass(frozen=True)
class RegisterDataAssetCommand:
    qualified_name: str
    name: str
    asset_type: AssetType
    description: Optional[str] = None
    owner: Optional[OwnerId] = None
    tags: List[str] = field(default_factory=list)

@dataclass(frozen=True)
class SearchDataAssetsQuery:
    query_text: Optional[str] = None
    asset_types: List[AssetType] = field(default_factory=list)
    tags: List[str] = field(default_factory=list)
    owner: Optional[OwnerId] = None
    limit: int = 50
    offset: int = 0
```

---

## Infrastructure Layer

### Inbound Adapters
**Definição**: Adaptam requisições externas para chamadas de use cases.

```python
class LambdaCatalogAdapter:
    def __init__(
        self,
        register_asset_use_case: RegisterDataAssetUseCase,
        search_assets_use_case: SearchDataAssetsUseCase
    ):
        self._register_asset_use_case = register_asset_use_case
        self._search_assets_use_case = search_assets_use_case
    
    def handle(self, event: dict, context: Any) -> dict:
        try:
            http_method = event.get('httpMethod')
            path = event.get('path')
            
            if http_method == 'POST' and path == '/assets':
                return self._handle_register_asset(event)
            elif http_method == 'GET' and path == '/assets/search':
                return self._handle_search_assets(event)
            else:
                return self._not_found_response()
        
        except Exception as e:
            return self._error_response(500, f"Internal server error: {str(e)}")
    
    def _handle_register_asset(self, event: dict) -> dict:
        try:
            body = json.loads(event.get('body', '{}'))
            request_data = RegisterAssetRequestData.from_dict(body)
            
            command = RegisterDataAssetCommand(
                qualified_name=request_data.qualified_name,
                name=request_data.name,
                asset_type=AssetType(request_data.asset_type),
                description=request_data.description,
                owner=OwnerId(request_data.owner) if request_data.owner else None,
                tags=request_data.tags
            )
            
            asset_id = self._register_asset_use_case.execute(command)
            
            response_data = RegisterAssetResponseData(
                asset_id=str(asset_id),
                message="Asset registered successfully"
            )
            
            return {
                'statusCode': 201,
                'body': json.dumps(asdict(response_data)),
                'headers': self._cors_headers()
            }
        
        except AssetAlreadyExistsError as e:
            return self._error_response(409, str(e))
        except ValidationError as e:
            return self._error_response(400, str(e))
    
    def _handle_search_assets(self, event: dict) -> dict:
        query_params = event.get('queryStringParameters', {}) or {}
        
        query = SearchDataAssetsQuery(
            query_text=query_params.get('q'),
            asset_types=[
                AssetType(t) for t in query_params.get('types', '').split(',')
                if t
            ],
            tags=query_params.get('tags', '').split(',') if query_params.get('tags') else [],
            owner=OwnerId(query_params.get('owner')) if query_params.get('owner') else None,
            limit=int(query_params.get('limit', 50)),
            offset=int(query_params.get('offset', 0))
        )
        
        result = self._search_assets_use_case.execute(query)
        
        response_data = SearchAssetsResponseData.from_search_result(result)
        
        return {
            'statusCode': 200,
            'body': json.dumps(asdict(response_data)),
            'headers': self._cors_headers()
        }
```

### Outbound Adapters
**Definição**: Implementam ports para comunicação com sistemas externos.

```python
class DynamoDBDataAssetRepository(DataAssetRepository):
    def __init__(self, table_name: str):
        self._dynamodb = boto3.resource('dynamodb')
        self._table = self._dynamodb.Table(table_name)
    
    def save(self, asset: DataAsset) -> None:
        asset_data = DataAssetDynamoData.from_entity(asset)
        self._table.put_item(Item=asdict(asset_data))
    
    def find_by_id(self, asset_id: DataAssetId) -> Optional[DataAsset]:
        response = self._table.get_item(Key={'id': str(asset_id)})
        item = response.get('Item')
        
        if not item:
            return None
        
        asset_data = DataAssetDynamoData(**item)
        return asset_data.to_entity()
    
    def find_by_qualified_name(self, qualified_name: QualifiedName) -> Optional[DataAsset]:
        response = self._table.query(
            IndexName='QualifiedNameIndex',
            KeyConditionExpression='qualified_name = :qname',
            ExpressionAttributeValues={':qname': str(qualified_name)}
        )
        
        items = response.get('Items', [])
        if not items:
            return None
        
        asset_data = DataAssetDynamoData(**items[0])
        return asset_data.to_entity()

class ElasticsearchDataAssetSearchRepository(DataAssetSearchRepository):
    def __init__(self, elasticsearch_client, index_name: str):
        self._es = elasticsearch_client
        self._index = index_name
    
    def search(self, criteria: SearchCriteria) -> SearchResult:
        query_body = self._build_elasticsearch_query(criteria)
        
        response = self._es.search(
            index=self._index,
            body=query_body,
            size=criteria.limit,
            from_=criteria.offset
        )
        
        assets = [
            self._map_hit_to_asset(hit) 
            for hit in response['hits']['hits']
        ]
        
        return SearchResult(
            assets=assets,
            total_count=response['hits']['total']['value'],
            query_time_ms=response['took']
        )
    
    def _build_elasticsearch_query(self, criteria: SearchCriteria) -> dict:
        must_clauses = []
        
        # Text search
        if criteria.query_text:
            must_clauses.append({
                'multi_match': {
                    'query': criteria.query_text,
                    'fields': ['name^3', 'description^2', 'qualified_name'],
                    'type': 'best_fields'
                }
            })
        
        # Asset type filter
        if criteria.asset_types:
            must_clauses.append({
                'terms': {
                    'asset_type': [t.value for t in criteria.asset_types]
                }
            })
        
        # Tags filter
        if criteria.tags:
            must_clauses.append({
                'terms': {
                    'tags': criteria.tags
                }
            })
        
        return {
            'query': {
                'bool': {
                    'must': must_clauses if must_clauses else [{'match_all': {}}]
                }
            },
            'sort': [
                {'_score': 'desc'},
                {'created_at': 'desc'}
            ]
        }
```

### Data Classes
**Definição**: Estruturas para transferência de dados entre camadas técnicas.

```python
@dataclass
class RegisterAssetRequestData:
    qualified_name: str
    name: str
    asset_type: str
    description: Optional[str] = None
    owner: Optional[str] = None
    tags: List[str] = field(default_factory=list)
    
    @classmethod
    def from_dict(cls, data: dict) -> 'RegisterAssetRequestData':
        return cls(
            qualified_name=data.get('qualified_name', ''),
            name=data.get('name', ''),
            asset_type=data.get('asset_type', ''),
            description=data.get('description'),
            owner=data.get('owner'),
            tags=data.get('tags', [])
        )

@dataclass
class RegisterAssetResponseData:
    asset_id: str
    message: str

@dataclass
class SearchAssetsResponseData:
    assets: List[Dict[str, Any]]
    total_count: int
    query_time_ms: int
    
    @classmethod
    def from_search_result(cls, result: SearchResult) -> 'SearchAssetsResponseData':
        return cls(
            assets=[
                {
                    'id': str(asset.id),
                    'qualified_name': str(asset.qualified_name),
                    'name': asset.name,
                    'asset_type': asset.asset_type.value,
                    'description': asset.description,
                    'quality_score': asset.quality_score.value if asset.quality_score.value >= 0 else None,
                    'owner': str(asset.owner) if asset.owner else None,
                    'tags': [tag.name for tag in asset.tags]
                }
                for asset in result.assets
            ],
            total_count=result.total_count,
            query_time_ms=result.query_time_ms
        )

@dataclass
class DataAssetDynamoData:
    id: str
    qualified_name: str
    name: str
    asset_type: str
    description: Optional[str]
    owner: Optional[str]
    quality_score_value: float
    quality_score_calculated_at: str
    tags: List[str]
    created_at: str
    updated_at: Optional[str]
    
    @classmethod
    def from_entity(cls, asset: DataAsset) -> 'DataAssetDynamoData':
        return cls(
            id=str(asset.id),
            qualified_name=str(asset.qualified_name),
            name=asset.name,
            asset_type=asset.asset_type.value,
            description=asset.description,
            owner=str(asset.owner) if asset.owner else None,
            quality_score_value=asset.quality_score.value,
            quality_score_calculated_at=asset.quality_score.calculated_at.isoformat(),
            tags=[tag.name for tag in asset.tags],
            created_at=asset.created_at.isoformat(),
            updated_at=asset.updated_at.isoformat() if asset.updated_at else None
        )
    
    def to_entity(self) -> DataAsset:
        return DataAsset(
            id=DataAssetId(self.id),
            qualified_name=QualifiedName(self.qualified_name),
            name=self.name,
            asset_type=AssetType(self.asset_type),
            description=self.description,
            owner=OwnerId(self.owner) if self.owner else None,
            quality_score=QualityScore(
                value=self.quality_score_value,
                calculated_at=datetime.fromisoformat(self.quality_score_calculated_at)
            ),
            tags=[Tag(name=tag) for tag in self.tags],
            created_at=datetime.fromisoformat(self.created_at),
            updated_at=datetime.fromisoformat(self.updated_at) if self.updated_at else None
        )
```

---

## Ports e Adapters

### Inbound Ports
**Definição**: Interfaces que definem operações que o domínio oferece.

```python
class AssetService(ABC):
    @abstractmethod
    def register_asset(self, command: RegisterDataAssetCommand) -> DataAssetId:
        pass
    
    @abstractmethod
    def search_assets(self, query: SearchDataAssetsQuery) -> SearchResult:
        pass
```

### Outbound Ports
**Definição**: Interfaces que definem dependências que o domínio precisa.

```python
class DataAssetRepository(ABC):
    @abstractmethod
    def save(self, asset: DataAsset) -> None:
        pass
    
    @abstractmethod
    def find_by_id(self, asset_id: DataAssetId) -> Optional[DataAsset]:
        pass
    
    @abstractmethod
    def find_by_qualified_name(self, qualified_name: QualifiedName) -> Optional[DataAsset]:
        pass

class DataAssetSearchRepository(ABC):
    @abstractmethod
    def search(self, criteria: SearchCriteria) -> SearchResult:
        pass

class EventPublisher(ABC):
    @abstractmethod
    def publish(self, event: DomainEvent) -> None:
        pass
```

---

## Fluxo de Dados

### Fluxo Inbound (Entrada)
```
External Request → Inbound Adapter → Use Case → Domain Entities
                                        ↓
                                   Outbound Ports → Outbound Adapters
```

### Fluxo Outbound (Saída)
```
Domain Entities → Outbound Ports → Outbound Adapters → External Systems
```

### Exemplo Completo de Fluxo - Data Catalog

```python
# 1. Request chega no adapter
POST /assets {"qualified_name": "warehouse.analytics.user_metrics", "name": "User Metrics", "asset_type": "TABLE"}

# 2. Adapter converte para command
command = RegisterDataAssetCommand(
    qualified_name="warehouse.analytics.user_metrics",
    name="User Metrics",
    asset_type=AssetType.TABLE
)

# 3. Use case executa lógica de negócio
asset = DataAsset.create(command.qualified_name, command.name, command.asset_type)

# 4. Use case chama repository (outbound port)
asset_repository.save(asset)

# 5. Repository adapter persiste no DynamoDB
dynamo_data = DataAssetDynamoData.from_entity(asset)
table.put_item(Item=asdict(dynamo_data))

# 6. Response retorna pelo mesmo caminho
return RegisterAssetResponseData(asset_id=str(asset.id), message="Created")
```

---

## Terminologias e Convenções

### Nomenclaturas por Contexto

#### Domain Layer
- **Entities**: `DataAsset`, `Classification`, `GovernancePolicy`
- **Value Objects**: `QualifiedName`, `QualityScore`, `LineageInfo`
- **Domain Services**: `LineageService`, `QualityAssessmentService`, `MetadataInferenceService`
- **Domain Events**: `DataAssetRegisteredEvent`, `DataQualityChangedEvent`
- **Exceptions**: `AssetAlreadyExistsError`, `InvalidQualityScoreError`

#### Application Layer
- **Use Cases**: `RegisterDataAssetUseCase`, `AssessDataQualityUseCase`
- **Commands**: `RegisterDataAssetCommand`, `AssessDataQualityCommand`
- **Queries**: `SearchDataAssetsQuery`, `TraceLineageQuery`
- **Application Services**: `ValidationService`, `AccessControlService`

#### Infrastructure Layer
- **Inbound Adapters**: `LambdaCatalogAdapter`, `EventBridgeAssetProcessor`
- **Outbound Adapters**: `DynamoDBAssetRepository`, `ElasticsearchSearchRepository`
- **Data Classes**: `RegisterAssetRequestData`, `DataAssetDynamoData`
- **Configuration**: `CatalogSettings`, `CatalogDependencyContainer`

### Convenções de Naming

#### Interfaces (Ports)
```python
# Outbound Ports - substantivos
DataAssetRepository
LineageRepository
ClassificationService
QualityAssessmentService

# Inbound Ports - serviços
AssetService
DiscoveryService
GovernanceService
```

#### Implementações (Adapters)
```python
# Prefixo da tecnologia + Port name
DynamoDBDataAssetRepository
ElasticsearchSearchRepository
MLClassificationService
OpenLineageService
GreatExpectationsQualityService
```

#### Use Cases
```python
# Verbo + substantivo + UseCase
RegisterDataAssetUseCase
SearchDataAssetsUseCase
AssessDataQualityUseCase
TraceDataLineageUseCase
```

#### Data Transfer Objects
```python
# Para requests/responses
RegisterAssetRequestData
SearchAssetsResponseData

# Para persistência
DataAssetDynamoData
LineageNeo4jData
```

---

## Estrutura de Pastas

```
data-catalog-service/
├── domain/
│   ├── entities/
│   │   ├── __init__.py
│   │   └── data_asset.py
│   ├── value_objects/
│   │   ├── __init__.py
│   │   ├── qualified_name.py
│   │   ├── quality_score.py
│   │   └── tag.py
│   ├── events/
│   │   ├── __init__.py
│   │   └── asset_events.py
│   ├── exceptions/
│   │   ├── __init__.py
│   │   └── catalog_errors.py
│   └── ports/
│       ├── __init__.py
│       ├── inbound/
│       │   ├── __init__.py
│       │   └── asset_service.py
│       └── outbound/
│           ├── __init__.py
│           ├── asset_repository.py
│           ├── search_repository.py
│           └── event_publisher.py
├── application/
│   ├── use_cases/
│   │   ├── __init__.py
│   │   ├── register_data_asset_use_case.py
│   │   └── search_data_assets_use_case.py
│   ├── commands/
│   │   ├── __init__.py
│   │   └── register_asset_command.py
│   ├── queries/
│   │   ├── __init__.py
│   │   └── search_assets_query.py
│   └── services/
│       ├── __init__.py
│       └── validation_service.py
└── infrastructure/
    ├── adapters/
    │   ├── inbound/
    │   │   ├── __init__.py
    │   │   ├── lambda_catalog_adapter.py
    │   │   └── eventbridge_asset_processor.py
    │   └── outbound/
    │       ├── __init__.py
    │       ├── dynamodb_asset_repository.py
    │       ├── elasticsearch_search_repository.py
    │       └── sns_event_publisher.py
    ├── data/
    │   ├── __init__.py
    │   ├── request_data.py
    │   ├── response_data.py
    │   └── persistence_data.py
    ├── config/
    │   ├── __init__.py
    │   ├── catalog_settings.py
    │   └── catalog_dependencies.py
    └── entrypoints/
        ├── __init__.py
        └── lambda_function.py
```

---

## Exemplo Prático

### Cenário: Microserviço de Data Catalog Simplificado

Um sistema que permite registrar e buscar ativos de dados como tabelas, arquivos, etc.

#### Entrypoint Principal

```python
# lambda_function.py
def lambda_handler(event: dict, context: Any) -> dict:
    """Main Lambda handler for data catalog operations"""
    
    # Initialize dependencies
    settings = CatalogSettings.from_environment()
    container = CatalogDependencyContainer(settings)
    
    # Create adapter
    catalog_adapter = LambdaCatalogAdapter(
        register_asset_use_case=container.register_asset_use_case(),
        search_assets_use_case=container.search_assets_use_case()
    )
    
    # Handle request
    return catalog_adapter.handle(event, context)

# infrastructure/config/catalog_dependencies.py
class CatalogDependencyContainer:
    def __init__(self, settings: CatalogSettings):
        self._settings = settings
        self._instances = {}
    
    def asset_repository(self) -> DataAssetRepository:
        if 'asset_repository' not in self._instances:
            self._instances['asset_repository'] = DynamoDBDataAssetRepository(
                table_name=self._settings.ASSETS_TABLE_NAME
            )
        return self._instances['asset_repository']
    
    def search_repository(self) -> DataAssetSearchRepository:
        if 'search_repository' not in self._instances:
            es_client = Elasticsearch([self._settings.ELASTICSEARCH_URL])
            self._instances['search_repository'] = ElasticsearchDataAssetSearchRepository(
                elasticsearch_client=es_client,
                index_name=self._settings.SEARCH_INDEX_NAME
            )
        return self._instances['search_repository']
    
    def event_publisher(self) -> EventPublisher:
        if 'event_publisher' not in self._instances:
            self._instances['event_publisher'] = SNSEventPublisher(
                topic_arn=self._settings.EVENTS_TOPIC_ARN
            )
        return self._instances['event_publisher']
    
    def register_asset_use_case(self) -> RegisterDataAssetUseCase:
        return RegisterDataAssetUseCase(
            asset_repository=self.asset_repository(),
            event_publisher=self.event_publisher()
        )
    
    def search_assets_use_case(self) -> SearchDataAssetsUseCase:
        return SearchDataAssetsUseCase(
            search_repository=self.search_repository()
        )
```

### Testing Strategy

```python
# tests/unit/domain/test_data_asset.py
class TestDataAsset:
    def test_create_asset_with_valid_data(self):
        # Arrange
        qualified_name = "warehouse.analytics.user_metrics"
        name = "User Metrics Table"
        asset_type = AssetType.TABLE
        
        # Act
        asset = DataAsset.create(qualified_name, name, asset_type)
        
        # Assert
        assert asset.qualified_name.value == qualified_name
        assert asset.name == name
        assert asset.asset_type == asset_type
        assert len(asset.tags) == 0
        assert asset.quality_score.value == -1.0  # Unknown
    
    def test_add_tag_successfully(self):
        # Arrange
        asset = self._create_basic_asset()
        tag = Tag(name="analytics")
        
        # Act
        asset.add_tag(tag)
        
        # Assert
        assert tag in asset.tags
        assert asset.updated_at is not None
    
    def test_update_quality_score_successfully(self):
        # Arrange
        asset = self._create_basic_asset()
        score = QualityScore.calculate(completeness=90.0, accuracy=85.0)
        
        # Act
        asset.update_quality(score)
        
        # Assert
        assert asset.quality_score.value == score.value
        assert asset.updated_at is not None

# tests/integration/test_register_asset_use_case.py
class TestRegisterAssetUseCase:
    @pytest.fixture
    def setup(self):
        # Mock dependencies
        self.mock_asset_repo = Mock(spec=DataAssetRepository)
        self.mock_event_publisher = Mock(spec=EventPublisher)
        
        self.use_case = RegisterDataAssetUseCase(
            asset_repository=self.mock_asset_repo,
            event_publisher=self.mock_event_publisher
        )
    
    def test_register_new_asset_successfully(self, setup):
        # Arrange
        command = RegisterDataAssetCommand(
            qualified_name="warehouse.analytics.user_metrics",
            name="User Metrics Table",
            asset_type=AssetType.TABLE,
            description="User engagement metrics",
            tags=["analytics", "user-data"]
        )
        
        self.mock_asset_repo.find_by_qualified_name.return_value = None
        
        # Act
        asset_id = self.use_case.execute(command)
        
        # Assert
        assert asset_id is not None
        self.mock_asset_repo.save.assert_called_once()
        self.mock_event_publisher.publish.assert_called_once()
        
        # Verify the event published
        published_event = self.mock_event_publisher.publish.call_args[0][0]
        assert isinstance(published_event, DataAssetRegisteredEvent)
        assert published_event.asset_id == asset_id
    
    def test_register_duplicate_asset_raises_error(self, setup):
        # Arrange
        command = RegisterDataAssetCommand(
            qualified_name="existing.asset",
            name="Existing Asset",
            asset_type=AssetType.TABLE
        )
        
        existing_asset = self._create_existing_asset()
        self.mock_asset_repo.find_by_qualified_name.return_value = existing_asset
        
        # Act & Assert
        with pytest.raises(AssetAlreadyExistsError):
            self.use_case.execute(command)
        
        # Verify no asset was saved
        self.mock_asset_repo.save.assert_not_called()

# tests/e2e/test_catalog_api.py
@pytest.mark.e2e
class TestCatalogAPI:
    def test_asset_registration_and_search_flow(self):
        """Test complete flow: register asset -> search for it"""
        
        # 1. Register asset
        register_payload = {
            "qualified_name": "test.warehouse.customer_data",
            "name": "Customer Data Table",
            "asset_type": "TABLE",
            "description": "Customer information",
            "tags": ["customer", "pii"]
        }
        
        response = self.post('/assets', json=register_payload)
        assert response.status_code == 201
        asset_id = response.json()['asset_id']
        
        # 2. Search for the asset
        search_response = self.get('/assets/search', params={'q': 'customer'})
        assert search_response.status_code == 200
        assert len(search_response.json()['assets']) >= 1
        
        found_asset = next(
            asset for asset in search_response.json()['assets']
            if asset['id'] == asset_id
        )
        assert found_asset['name'] == "Customer Data Table"
        assert 'customer' in found_asset['tags']
```

---

## Boas Práticas

### 1. Dependency Injection
```python
# infrastructure/config/catalog_dependencies.py
class CatalogDependencyContainer:
    def __init__(self, settings: CatalogSettings):
        self._settings = settings
        self._instances = {}
    
    def asset_repository(self) -> DataAssetRepository:
        if 'asset_repository' not in self._instances:
            self._instances['asset_repository'] = DynamoDBDataAssetRepository(
                table_name=self._settings.ASSETS_TABLE_NAME
            )
        return self._instances['asset_repository']
    
    def search_repository(self) -> DataAssetSearchRepository:
        if 'search_repository' not in self._instances:
            es_client = Elasticsearch([self._settings.ELASTICSEARCH_URL])
            self._instances['search_repository'] = ElasticsearchDataAssetSearchRepository(
                elasticsearch_client=es_client,
                index_name=self._settings.SEARCH_INDEX_NAME
            )
        return self._instances['search_repository']
```

### 2. Error Handling
```python
# domain/exceptions/catalog_errors.py
class CatalogError(Exception):
    pass

class AssetAlreadyExistsError(CatalogError):
    def __init__(self, qualified_name: str):
        super().__init__(f"Asset with qualified name '{qualified_name}' already exists")

class AssetNotFoundError(CatalogError):
    def __init__(self, asset_id: DataAssetId):
        super().__init__(f"Asset with id '{asset_id}' not found")

class InvalidQualityScoreError(CatalogError):
    def __init__(self, score: QualityScore):
        super().__init__(f"Invalid quality score: {score.value}. Must be between 0 and 100")
```

### 3. Configuration
```python
# infrastructure/config/catalog_settings.py
@dataclass
class CatalogSettings:
    # Infrastructure
    ASSETS_TABLE_NAME: str = os.getenv('ASSETS_TABLE_NAME', 'data_assets')
    ELASTICSEARCH_URL: str = os.getenv('ELASTICSEARCH_URL', 'https://localhost:9200')
    SEARCH_INDEX_NAME: str = os.getenv('SEARCH_INDEX_NAME', 'data_catalog')
    EVENTS_TOPIC_ARN: str = os.getenv('EVENTS_TOPIC_ARN', '')
    
    # Application
    LOG_LEVEL: str = os.getenv('LOG_LEVEL', 'INFO')
    DEBUG: bool = os.getenv('DEBUG', 'false').lower() == 'true'
    
    @classmethod
    def from_environment(cls) -> 'CatalogSettings':
        return cls()
    
    def validate(self) -> None:
        """Validate configuration settings"""
        required_settings = [
            'ASSETS_TABLE_NAME',
            'ELASTICSEARCH_URL'
        ]
        
        missing = [
            setting for setting in required_settings
            if not getattr(self, setting)
        ]
        
        if missing:
            raise ConfigurationError(f"Missing required settings: {missing}")
```

### 4. Event-Driven Architecture
```python
# infrastructure/adapters/inbound/eventbridge_asset_processor.py
class EventBridgeAssetProcessor:
    """Process external events from EventBridge for asset operations"""
    
    def __init__(
        self,
        register_asset_use_case: RegisterDataAssetUseCase,
        search_assets_use_case: SearchDataAssetsUseCase
    ):
        self._register_asset_use_case = register_asset_use_case
        self._search_assets_use_case = search_assets_use_case
    
    def handle(self, event: dict, context: Any) -> dict:
        """Handle EventBridge events - INBOUND ADAPTER"""
        
        try:
            # Parse EventBridge event
            detail = event.get('detail', {})
            source = event.get('source', '')
            detail_type = event.get('detail-type', '')
            
            if source == 'aws.glue' and detail_type == 'Glue Data Catalog Table State Change':
                return self._handle_glue_table_event(detail)
            elif source == 'aws.s3' and detail_type == 'Object Created':
                return self._handle_s3_object_event(detail)
            else:
                return {'statusCode': 200, 'body': 'Event type not handled'}
        
        except Exception as e:
            return {'statusCode': 500, 'body': f'Error processing event: {str(e)}'}
    
    def _handle_glue_table_event(self, detail: dict) -> dict:
        """Handle Glue table creation/update events"""
        
        table_name = detail.get('tableName', '')
        database_name = detail.get('databaseName', '')
        
        if not table_name or not database_name:
            return {'statusCode': 400, 'body': 'Missing table or database name'}
        
        # Auto-register table as data asset
        command = RegisterDataAssetCommand(
            qualified_name=f"glue:{database_name}.{table_name}",
            name=table_name,
            asset_type=AssetType.TABLE,
            description=f"Auto-discovered from AWS Glue: {database_name}.{table_name}",
            tags=["auto-discovered", "glue", database_name]
        )
        
        try:
            asset_id = self._register_asset_use_case.execute(command)
            return {
                'statusCode': 201,
                'body': f'Asset registered with ID: {asset_id}'
            }
        except AssetAlreadyExistsError:
            return {
                'statusCode': 409,
                'body': f'Asset {command.qualified_name} already exists'
            }
    
    def _handle_s3_object_event(self, detail: dict) -> dict:
        """Handle S3 object creation events"""
        
        bucket = detail.get('bucket', {}).get('name', '')
        key = detail.get('object', {}).get('key', '')
        
        if not bucket or not key:
            return {'statusCode': 400, 'body': 'Missing bucket or object key'}
        
        # Only register certain file types
        if not self._is_data_file(key):
            return {'statusCode': 200, 'body': 'File type not relevant for catalog'}
        
        # Auto-register S3 object as data asset
        command = RegisterDataAssetCommand(
            qualified_name=f"s3://{bucket}/{key}",
            name=key.split('/')[-1],  # filename
            asset_type=AssetType.FILE,
            description=f"Auto-discovered from S3: s3://{bucket}/{key}",
            tags=["auto-discovered", "s3", bucket]
        )
        
        try:
            asset_id = self._register_asset_use_case.execute(command)
            return {
                'statusCode': 201,
                'body': f'Asset registered with ID: {asset_id}'
            }
        except AssetAlreadyExistsError:
            return {
                'statusCode': 409,
                'body': f'Asset {command.qualified_name} already exists'
            }
    
    def _is_data_file(self, key: str) -> bool:
        """Check if file is a data file worth cataloging"""
        data_extensions = ['.csv', '.parquet', '.json', '.avro', '.orc']
        return any(key.lower().endswith(ext) for ext in data_extensions)

# infrastructure/adapters/outbound/sns_event_publisher.py
class SNSEventPublisher(EventPublisher):
    """Publishes domain events to external systems via SNS"""
    
    def __init__(self, topic_arn: str):
        self._sns = boto3.client('sns')
        self._topic_arn = topic_arn
    
    def publish(self, event: DomainEvent) -> None:
        message = {
            'event_type': type(event).__name__,
            'event_data': asdict(event),
            'timestamp': datetime.utcnow().isoformat()
        }
        
        self._sns.publish(
            TopicArn=self._topic_arn,
            Message=json.dumps(message),
            Subject=f"Data Catalog Event: {type(event).__name__}"
        )
```

## Entrypoints para Different Adapters

```python
# lambda_function.py - API Inbound Adapter
def lambda_handler(event: dict, context: Any) -> dict:
    """Main Lambda handler for API requests"""
    
    settings = CatalogSettings.from_environment()
    container = CatalogDependencyContainer(settings)
    
    catalog_adapter = LambdaCatalogAdapter(
        register_asset_use_case=container.register_asset_use_case(),
        search_assets_use_case=container.search_assets_use_case()
    )
    
    return catalog_adapter.handle(event, context)

# event_processor_lambda.py - EventBridge Inbound Adapter  
def lambda_handler(event: dict, context: Any) -> dict:
    """Lambda handler for EventBridge events"""
    
    settings = CatalogSettings.from_environment()
    container = CatalogDependencyContainer(settings)
    
    event_processor = EventBridgeAssetProcessor(
        register_asset_use_case=container.register_asset_use_case(),
        search_assets_use_case=container.search_assets_use_case()
    )
    
    return event_processor.handle(event, context)
```

---

## Resumo da Arquitetura

### **Benefícios Alcançados:**

1. **Separação Clara de Responsabilidades**: Domain, Application e Infrastructure bem definidos
2. **Testabilidade**: Fácil mock de dependências através dos ports
3. **Flexibilidade**: Trocar DynamoDB por PostgreSQL sem alterar use cases
4. **Extensibilidade**: Adicionar novos tipos de assets ou funcionalidades
5. **Manutenibilidade**: Código organizado e com baixo acoplamento

### **Fluxo Simplificado:**

```
1. HTTP Request → Lambda Adapter
2. Adapter → Use Case (via Command/Query)
3. Use Case → Domain Logic + Repository
4. Repository → DynamoDB/Elasticsearch
5. Response ← volta pela mesma rota
```

### **Use Cases Implementados:**

- **RegisterDataAssetUseCase**: Registra novos ativos de dados
- **SearchDataAssetsUseCase**: Busca ativos por critérios

Esta arquitetura simplificada mantém todos os benefícios da arquitetura hexagonal enquanto demonstra claramente os conceitos fundamentais com apenas 2 use cases focados!