export const mockTables = [
  {
    guid: "table-001",
    qualifiedName: "default/snowflake/1234567890/FINANCE_DB/ACCOUNTS/CUSTOMER_ACCOUNTS",
    name: "CUSTOMER_ACCOUNTS",
    connection: "snowflake",
    database: "FINANCE_DB",
    schema: "ACCOUNTS",
    description: "Main customer accounts table containing all active and inactive account records",
    userDescription: "This table stores comprehensive customer account information including personal details, account status, and relationship data",
    certificateStatus: "VERIFIED",
    ownerUsers: ["john.silva@banco.com", "maria.santos@banco.com"],
    ownerGroups: ["G_ATLAN_FIN_BTSTEWARD"],
    classifications: ["PII", "FINANCIAL", "CRITICAL"],
    columnCount: 45,
    updatedAt: "2024-12-10T10:30:00Z",
    customMetadata: {
      DisponibilizacaoAtivo: {
        Periodicidade: "Diaria",
        DefasagemCarga: "D-1",
        RetencaoMeses: 24
      },
      GoldenSource: {
        GoldenSource: true,
        EntidadeConceitual: "Contas de Clientes"
      }
    }
  },
  {
    guid: "table-002",
    qualifiedName: "default/snowflake/1234567890/FINANCE_DB/TRANSACTIONS/PAYMENT_HISTORY",
    name: "PAYMENT_HISTORY",
    connection: "snowflake",
    database: "FINANCE_DB", 
    schema: "TRANSACTIONS",
    description: "Historical payment transactions for all customer accounts",
    certificateStatus: "VERIFIED",
    ownerUsers: ["carlos.oliveira@banco.com"],
    ownerGroups: ["G_ATLAN_DE_BTSTEWARD"],
    classifications: ["FINANCIAL", "AUDIT"],
    columnCount: 32,
    updatedAt: "2024-12-09T14:20:00Z",
    customMetadata: {
      DisponibilizacaoAtivo: {
        Periodicidade: "Diaria",
        DefasagemCarga: "D0",
        RetencaoMeses: 12
      },
      GoldenSource: {
        GoldenSource: false,
        EntidadeConceitual: "Histórico de Pagamentos"
      }
    }
  },
  {
    guid: "table-003",
    qualifiedName: "default/postgres/1234567890/RISK_DB/ANALYSIS/CREDIT_SCORES",
    name: "CREDIT_SCORES",
    connection: "postgres",
    database: "RISK_DB",
    schema: "ANALYSIS",
    description: "Credit scoring and risk assessment data",
    certificateStatus: "DRAFT",
    ownerUsers: ["ana.costa@banco.com"],
    ownerGroups: ["G_ATLAN_RSK_BTSTEWARD"],
    classifications: ["SENSITIVE", "RISK"],
    columnCount: 28,
    updatedAt: "2024-12-08T09:15:00Z",
    customMetadata: {
      DisponibilizacaoAtivo: {
        Periodicidade: "Semanal",
        DefasagemCarga: "D-2",
        RetencaoMeses: 36
      },
      GoldenSource: {
        GoldenSource: true,
        EntidadeConceitual: "Análise de Crédito"
      }
    }
  },
  {
    guid: "table-004",
    qualifiedName: "default/databricks/1234567890/MARKETING_DB/CAMPAIGNS/CUSTOMER_SEGMENTS",
    name: "CUSTOMER_SEGMENTS",
    connection: "databricks",
    database: "MARKETING_DB",
    schema: "CAMPAIGNS",
    description: "Customer segmentation for marketing campaigns",
    certificateStatus: "VERIFIED",
    ownerUsers: ["pedro.santos@banco.com"],
    ownerGroups: ["G_ATLAN_MKT_BTSTEWARD"],
    classifications: ["MARKETING", "ANALYTICS"],
    columnCount: 18,
    updatedAt: "2024-12-07T16:45:00Z",
    customMetadata: {
      DisponibilizacaoAtivo: {
        Periodicidade: "Mensal",
        DefasagemCarga: "D-1",
        RetencaoMeses: 6
      },
      GoldenSource: {
        GoldenSource: false,
        EntidadeConceitual: "Segmentação de Clientes"
      }
    }
  },
  {
    guid: "table-005",
    qualifiedName: "default/snowflake/1234567890/COMPLIANCE_DB/REGULATORY/KYC_RECORDS",
    name: "KYC_RECORDS",
    connection: "snowflake",
    database: "COMPLIANCE_DB",
    schema: "REGULATORY",
    description: "Know Your Customer compliance records",
    certificateStatus: "VERIFIED",
    ownerUsers: ["compliance.team@banco.com"],
    ownerGroups: ["G_ATLAN_CMP_BTSTEWARD"],
    classifications: ["PII", "REGULATORY", "CRITICAL"],
    columnCount: 52,
    updatedAt: "2024-12-11T11:30:00Z",
    customMetadata: {
      DisponibilizacaoAtivo: {
        Periodicidade: "Diaria",
        DefasagemCarga: "D0",
        RetencaoMeses: 60
      },
      GoldenSource: {
        GoldenSource: true,
        EntidadeConceitual: "Registros KYC"
      }
    }
  },
  {
    guid: "table-006",
    qualifiedName: "default/postgres/1234567890/PRODUCTS_DB/CATALOG/PRODUCT_OFFERINGS",
    name: "PRODUCT_OFFERINGS",
    connection: "postgres", 
    database: "PRODUCTS_DB",
    schema: "CATALOG",
    description: "Bank product catalog and offerings",
    certificateStatus: "DRAFT",
    ownerUsers: ["product.team@banco.com"],
    ownerGroups: ["G_ATLAN_PRD_BTSTEWARD"],
    classifications: ["PRODUCT", "PUBLIC"],
    columnCount: 24,
    updatedAt: "2024-12-06T13:20:00Z",
    customMetadata: {
      DisponibilizacaoAtivo: {
        Periodicidade: "Semanal",
        DefasagemCarga: "D-1",
        RetencaoMeses: 12
      },
      GoldenSource: {
        GoldenSource: false,
        EntidadeConceitual: "Catálogo de Produtos"
      }
    }
  },
  {
    guid: "table-007",
    qualifiedName: "default/snowflake/1234567890/AUDIT_DB/LOGS/TRANSACTION_AUDIT",
    name: "TRANSACTION_AUDIT",
    connection: "snowflake",
    database: "AUDIT_DB",
    schema: "LOGS",
    description: "Audit logs for all financial transactions",
    certificateStatus: "VERIFIED",
    ownerUsers: ["audit.team@banco.com"],
    ownerGroups: ["G_ATLAN_AUD_BTSTEWARD"],
    classifications: ["AUDIT", "REGULATORY", "RETENTION_7Y"],
    columnCount: 38,
    updatedAt: "2024-12-11T08:00:00Z",
    customMetadata: {
      DisponibilizacaoAtivo: {
        Periodicidade: "Diaria",
        DefasagemCarga: "D0",
        RetencaoMeses: 84
      },
      GoldenSource: {
        GoldenSource: true,
        EntidadeConceitual: "Auditoria de Transações"
      }
    }
  },
  {
    guid: "table-008",
    qualifiedName: "default/databricks/1234567890/HR_DB/EMPLOYEES/STAFF_RECORDS",
    name: "STAFF_RECORDS",
    connection: "databricks",
    database: "HR_DB",
    schema: "EMPLOYEES",
    description: "Employee records and organizational data",
    certificateStatus: "DEPRECATED",
    ownerUsers: ["hr.admin@banco.com"],
    ownerGroups: ["G_ATLAN_HR_BTSTEWARD"],
    classifications: ["PII", "INTERNAL", "SENSITIVE"],
    columnCount: 42,
    updatedAt: "2024-12-05T10:15:00Z",
    customMetadata: {
      DisponibilizacaoAtivo: {
        Periodicidade: "Mensal",
        DefasagemCarga: "D-2",
        RetencaoMeses: 18
      },
      GoldenSource: {
        GoldenSource: false,
        EntidadeConceitual: "Registros de Funcionários"
      }
    }
  }
];

export const mockColumns = {
  "table-001": [
    {
      guid: "col-001-001",
      qualifiedName: "default/snowflake/1234567890/FINANCE_DB/ACCOUNTS/CUSTOMER_ACCOUNTS/ACCOUNT_ID",
      name: "ACCOUNT_ID",
      dataType: "VARCHAR(20)",
      description: "Unique account identifier",
      isNullable: false,
      isUniqueKey: true,
      allowedValues: []
    },
    {
      guid: "col-001-002",
      qualifiedName: "default/snowflake/1234567890/FINANCE_DB/ACCOUNTS/CUSTOMER_ACCOUNTS/CUSTOMER_NAME",
      name: "CUSTOMER_NAME",
      dataType: "VARCHAR(255)",
      description: "Full name of the customer",
      isNullable: false,
      isUniqueKey: false,
      allowedValues: []
    },
    {
      guid: "col-001-003",
      qualifiedName: "default/snowflake/1234567890/FINANCE_DB/ACCOUNTS/CUSTOMER_ACCOUNTS/CPF",
      name: "CPF",
      dataType: "VARCHAR(11)",
      description: "Customer CPF number",
      isNullable: false,
      isUniqueKey: true,
      allowedValues: []
    },
    {
      guid: "col-001-004",
      qualifiedName: "default/snowflake/1234567890/FINANCE_DB/ACCOUNTS/CUSTOMER_ACCOUNTS/ACCOUNT_STATUS",
      name: "ACCOUNT_STATUS",
      dataType: "VARCHAR(20)",
      description: "Current account status",
      isNullable: false,
      isUniqueKey: false,
      allowedValues: ["ACTIVE", "INACTIVE", "SUSPENDED", "CLOSED"]
    },
    {
      guid: "col-001-005",
      qualifiedName: "default/snowflake/1234567890/FINANCE_DB/ACCOUNTS/CUSTOMER_ACCOUNTS/BALANCE",
      name: "BALANCE",
      dataType: "DECIMAL(15,2)",
      description: "Current account balance",
      isNullable: true,
      isUniqueKey: false,
      allowedValues: []
    }
  ]
};

export const customMetadataGroups = [
  {
    name: "DisponibilizacaoAtivo",
    displayName: "Disponibilização do Ativo",
    description: "Configurações de disponibilização e retenção do ativo de dados",
    icon: "📋",
    applicableAssetTypes: ["Table"],
    properties: [
      {
        name: "Periodicidade",
        displayName: "Periodicidade",
        type: "options",
        description: "Frequência de atualização dos dados",
        enumValues: ["Diaria", "Semanal", "Mensal"],
        required: false,
        loadFromEndpoint: "/api/options/periodicidade"
      },
      {
        name: "DefasagemCarga",
        displayName: "Defasagem da carga",
        type: "options",
        description: "Defasagem temporal da carga de dados",
        enumValues: ["D0", "D-1", "D-2"],
        required: false,
        loadFromEndpoint: "/api/options/defasagem"
      },
      {
        name: "RetencaoMeses",
        displayName: "Retenção (meses)",
        type: "number",
        description: "Período de retenção dos dados em meses",
        minValue: 1,
        maxValue: 60,
        required: false,
        placeholder: "6"
      }
    ]
  },
  {
    name: "GoldenSource",
    displayName: "Golden Source",
    description: "Definições de fonte autoritativa dos dados",
    icon: "⭐",
    applicableAssetTypes: ["Table"],
    properties: [
      {
        name: "GoldenSource",
        displayName: "Golden source",
        type: "boolean",
        description: "Indica se é a fonte autoritativa dos dados",
        required: false
      },
      {
        name: "EntidadeConceitual",
        displayName: "Entidade conceitual",
        type: "text",
        description: "Nome da entidade conceitual representada",
        required: false,
        placeholder: "Catalogo de Dados"
      }
    ]
  },
  {
    name: "OfertaServicoNegocio",
    displayName: "Ofertas e Serviços de Negócio",
    description: "Ofertas de produtos e serviços relacionados aos dados",
    icon: "🎯",
    applicableAssetTypes: ["Table", "Column"],
    isBusinessOfferGroup: true,
    allowMultiple: true,
    properties: []
  }
];

export const businessOffers = [
  {
    id: "OF001",
    name: "Conta Corrente Premium",
    category: "Banking",
    description: "Conta corrente com benefícios exclusivos para clientes premium",
    active: true
  },
  {
    id: "OF002",
    name: "Cartão de Crédito Gold",
    category: "Credit",
    description: "Cartão com limite diferenciado e programa de pontos",
    active: true
  },
  {
    id: "OF003",
    name: "Investimento CDB Plus",
    category: "Investment",
    description: "CDB com rentabilidade acima da média do mercado",
    active: true
  },
  {
    id: "OF004",
    name: "Seguro Residencial Completo",
    category: "Insurance",
    description: "Proteção completa para residências",
    active: true
  },
  {
    id: "OF005",
    name: "Crédito Consignado Especial",
    category: "Credit",
    description: "Empréstimo com desconto em folha e taxas reduzidas",
    active: true
  },
  {
    id: "OF006",
    name: "Previdência Privada Gold",
    category: "Investment",
    description: "Plano de previdência com benefícios fiscais",
    active: true
  },
  {
    id: "OF007",
    name: "Conta Poupança Digital",
    category: "Banking",
    description: "Conta poupança 100% digital sem taxas",
    active: true
  },
  {
    id: "OF008",
    name: "Financiamento Imobiliário",
    category: "Credit",
    description: "Crédito para aquisição de imóveis com taxas competitivas",
    active: true
  }
];