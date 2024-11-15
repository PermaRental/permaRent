export const systemPrompt = `
You are a professional contract analyzer specialized in rental agreements. Your task is to extract key parameters from a rental contract image for blockchain smart contract deployment. Follow these instructions carefully:

1. Analyze the contract image thoroughly, focusing on extracting the required information.

2. Extract the following core parameters:
   - Rental amount (monthly/periodic payment)
   - Security deposit amount
   - Payment interval
   - Total number of rental periods
   - Lessor information
   - Lessee information
   - Contract start date
   - Contract end date
   - Type of rental property
   - Brief property description

3. Format the extracted information into the following JSON structure:
<json_format>
{
    "basicInfo": {
        "rentalAmount": "",
        "securityDeposit": "",
        "paymentInterval": "",
        "totalRentalPeriods": ""
    },
    "parties": {
        "lessor": "",
        "lessee": ""
    },
    "timeline": {
        "startDate": "",
        "endDate": ""
    },
    "property": {
        "type": "",
        "description": ""
    }
}
</json_format>

4. Follow these rules when extracting and formatting the information:
   - Use only numerical values for amounts
   - Convert all dates to YYYY-MM-DD format
   - If any required field is not found, use "NOT_FOUND"
   - Convert payment interval to number of days
   - Ensure all monetary values are in the same currency unit

5. After creating the JSON output, provide:
   - A confidence level (High/Medium/Low) for each extracted parameter
   - Any warnings about unclear or ambiguous information
   - Suggestions if any critical information is missing

6. Present your final output in the following format:
   <json_output>
   [Insert the completed JSON structure here]
   </json_output>

   <analysis>
   [Insert confidence levels, warnings, and suggestions here]
   </analysis>

Remember to be thorough in your analysis and precise in your extraction of information. If you're unsure about any details, indicate this in your confidence levels and analysis.
`;

// 函数定义
export const extract_rental_contract = {
  name: 'extract_rental_contract',
  description:
    'Extract key parameters from rental contract image for blockchain smart contract deployment',
  parameters: {
    type: 'object',
    properties: {
      basicInfo: {
        type: 'object',
        properties: {
          rentalAmount: {
            type: 'number',
            description: 'Monthly/periodic rental payment amount',
          },
          securityDeposit: {
            type: 'number',
            description: 'Security deposit amount',
          },
          paymentInterval: {
            type: 'number',
            description: 'Payment interval in days',
          },
          totalRentalPeriods: {
            type: 'number',
            description: 'Total number of rental periods',
          },
        },
        required: [
          'rentalAmount',
          'securityDeposit',
          'paymentInterval',
          'totalRentalPeriods',
        ],
      },
      parties: {
        type: 'object',
        properties: {
          lessor: {
            type: 'string',
            description: 'Lessor information',
          },
          lessee: {
            type: 'string',
            description: 'Lessee information',
          },
        },
        required: ['lessor', 'lessee'],
      },
      timeline: {
        type: 'object',
        properties: {
          startDate: {
            type: 'string',
            format: 'date',
            description: 'Contract start date in YYYY-MM-DD format',
          },
          endDate: {
            type: 'string',
            format: 'date',
            description: 'Contract end date in YYYY-MM-DD format',
          },
        },
        required: ['startDate', 'endDate'],
      },
      property: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            description: 'Type of rental property',
          },
          description: {
            type: 'string',
            description: 'Brief property description',
          },
        },
        required: ['type', 'description'],
      },
      confidence: {
        type: 'object',
        properties: {
          level: {
            type: 'string',
            enum: ['High', 'Medium', 'Low'],
            description: 'Overall confidence level of extracted information',
          },
          warnings: {
            type: 'array',
            items: {
              type: 'string',
            },
            description:
              'List of warnings about unclear or ambiguous information',
          },
          suggestions: {
            type: 'array',
            items: {
              type: 'string',
            },
            description:
              'List of suggestions for missing or incomplete information',
          },
        },
        required: ['level', 'warnings', 'suggestions'],
      },
    },
    required: ['basicInfo', 'parties', 'timeline', 'property', 'confidence'],
  },
} as const;
