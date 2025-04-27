export const customStyles = {
    control: (provided) => ({
        ...provided,
        
        borderRadius: '0.375rem', // Tailwind: rounded-md
        borderColor: '#D1D5DB', // Tailwind: border-gray-300
        boxShadow: "none",
        '&:hover': {
            borderColor: '#4B5563' // Tailwind: hover:border-indigo-300
        },
        '&:focus-within': {
            borderColor: '#6366F1', // Tailwind: focus:border-indigo-300
            boxShadow: '0 0 0 1px #C7D2FE' // Tailwind: focus:ring-indigo-200
        },
        '& input': {
            border: 'none', // Remove border from input element
            outline: 'none', // Remove outline from input element
            boxShadow: 'none' // Remove shadow from input element
        }
    }),
    menu: (provided) => ({
        ...provided,
        borderRadius: '0.375rem', // Tailwind: rounded-md
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.1)' // Tailwind: shadow-sm
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? '#E5E7EB' : state.isFocused ? '#F3F4F6' : undefined, // Tailwind: bg-gray-200 & bg-gray-100
        color: '#191919', // Tailwind: text-gray-700
        cursor: 'pointer', // Ensure options are clickable
        '&:hover': {
            backgroundColor: '#E5E7EB' // Tailwind: hover:bg-gray-200
        }
    }),
    singleValue: (provided) => ({
        ...provided,
        color: '#374151' // Tailwind: text-gray-700
    }),
    indicatorSeparator: () => ({
        display: 'none' // Remove the indicator separator line
    }),
    dropdownIndicator: (provided) => ({
        ...provided,
        color: '#9CA3AF' // Tailwind: text-gray-400
    }),
    input: (base) => ({
        ...base,
        "input:focus": {
             boxShadow: "none",
             },
      })
};
