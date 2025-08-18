// Atlan brand colors
export const ATLAN_COLORS = {
  primary: '#2960d4',
  primaryHover: '#1e4ba8',
  primaryLight: '#e0ecfe',
  primaryDark: '#14367c'
};

// Utility functions for consistent styling
export const getAtlanButtonStyle = (variant = 'primary') => {
  const baseStyle = {
    transition: 'all 0.15s ease-in-out',
    cursor: 'pointer'
  };

  switch (variant) {
    case 'primary':
      return {
        ...baseStyle,
        backgroundColor: ATLAN_COLORS.primary,
        color: 'white'
      };
    case 'secondary':
      return {
        ...baseStyle,
        backgroundColor: 'white',
        color: '#374151',
        border: '1px solid #d1d5db'
      };
    case 'ghost':
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
        color: ATLAN_COLORS.primary
      };
    default:
      return baseStyle;
  }
};

export const handleAtlanHover = (element, variant = 'primary') => {
  switch (variant) {
    case 'primary':
      element.style.backgroundColor = ATLAN_COLORS.primaryHover;
      break;
    case 'secondary':
      element.style.backgroundColor = '#f9fafb';
      break;
    case 'ghost':
      element.style.backgroundColor = ATLAN_COLORS.primaryLight;
      break;
  }
};

export const handleAtlanLeave = (element, variant = 'primary') => {
  switch (variant) {
    case 'primary':
      element.style.backgroundColor = ATLAN_COLORS.primary;
      break;
    case 'secondary':
      element.style.backgroundColor = 'white';
      break;
    case 'ghost':
      element.style.backgroundColor = 'transparent';
      break;
  }
};