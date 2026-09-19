const COUNTRIES = [
  {
    "code": "AF",
    "name": "Afeganistão",
    "apiName": "Afghanistan"
  },
  {
    "code": "AL",
    "name": "Albânia",
    "apiName": "Albania"
  },
  {
    "code": "DE",
    "name": "Alemanha",
    "apiName": "Germany"
  },
  {
    "code": "AD",
    "name": "Andorra",
    "apiName": "Andorra"
  },
  {
    "code": "AO",
    "name": "Angola",
    "apiName": "Angola"
  },
  {
    "code": "AI",
    "name": "Anguila",
    "apiName": "Anguilla"
  },
  {
    "code": "AQ",
    "name": "Antártida",
    "apiName": "Antarctica"
  },
  {
    "code": "AG",
    "name": "Antígua e Barbuda",
    "apiName": "Antigua & Barbuda"
  },
  {
    "code": "AR",
    "name": "Argentina",
    "apiName": "Argentina"
  },
  {
    "code": "DZ",
    "name": "Argélia",
    "apiName": "Algeria"
  },
  {
    "code": "AM",
    "name": "Armênia",
    "apiName": "Armenia"
  },
  {
    "code": "AW",
    "name": "Aruba",
    "apiName": "Aruba"
  },
  {
    "code": "SA",
    "name": "Arábia Saudita",
    "apiName": "Saudi Arabia"
  },
  {
    "code": "AU",
    "name": "Austrália",
    "apiName": "Australia"
  },
  {
    "code": "AZ",
    "name": "Azerbaijão",
    "apiName": "Azerbaijan"
  },
  {
    "code": "BS",
    "name": "Bahamas",
    "apiName": "Bahamas"
  },
  {
    "code": "BD",
    "name": "Bangladesh",
    "apiName": "Bangladesh"
  },
  {
    "code": "BB",
    "name": "Barbados",
    "apiName": "Barbados"
  },
  {
    "code": "BH",
    "name": "Barein",
    "apiName": "Bahrain"
  },
  {
    "code": "BZ",
    "name": "Belize",
    "apiName": "Belize"
  },
  {
    "code": "BJ",
    "name": "Benin",
    "apiName": "Benin"
  },
  {
    "code": "BM",
    "name": "Bermudas",
    "apiName": "Bermuda"
  },
  {
    "code": "BY",
    "name": "Bielorrússia",
    "apiName": "Belarus"
  },
  {
    "code": "BO",
    "name": "Bolívia",
    "apiName": "Bolivia"
  },
  {
    "code": "BW",
    "name": "Botsuana",
    "apiName": "Botswana"
  },
  {
    "code": "BR",
    "name": "Brasil",
    "apiName": "Brazil"
  },
  {
    "code": "BN",
    "name": "Brunei",
    "apiName": "Brunei"
  },
  {
    "code": "BG",
    "name": "Bulgária",
    "apiName": "Bulgaria"
  },
  {
    "code": "BF",
    "name": "Burquina Faso",
    "apiName": "Burkina Faso"
  },
  {
    "code": "BI",
    "name": "Burundi",
    "apiName": "Burundi"
  },
  {
    "code": "BT",
    "name": "Butão",
    "apiName": "Bhutan"
  },
  {
    "code": "BE",
    "name": "Bélgica",
    "apiName": "Belgium"
  },
  {
    "code": "BA",
    "name": "Bósnia e Herzegovina",
    "apiName": "Bosnia & Herzegovina"
  },
  {
    "code": "CV",
    "name": "Cabo Verde",
    "apiName": "Cape Verde"
  },
  {
    "code": "CM",
    "name": "Camarões",
    "apiName": "Cameroon"
  },
  {
    "code": "KH",
    "name": "Camboja",
    "apiName": "Cambodia"
  },
  {
    "code": "CA",
    "name": "Canadá",
    "apiName": "Canada"
  },
  {
    "code": "QA",
    "name": "Catar",
    "apiName": "Qatar"
  },
  {
    "code": "KZ",
    "name": "Cazaquistão",
    "apiName": "Kazakhstan"
  },
  {
    "code": "TD",
    "name": "Chade",
    "apiName": "Chad"
  },
  {
    "code": "CL",
    "name": "Chile",
    "apiName": "Chile"
  },
  {
    "code": "CN",
    "name": "China",
    "apiName": "China"
  },
  {
    "code": "CY",
    "name": "Chipre",
    "apiName": "Cyprus"
  },
  {
    "code": "VA",
    "name": "Cidade do Vaticano",
    "apiName": "Vatican City"
  },
  {
    "code": "CO",
    "name": "Colômbia",
    "apiName": "Colombia"
  },
  {
    "code": "KM",
    "name": "Comores",
    "apiName": "Comoros"
  },
  {
    "code": "CD",
    "name": "Congo - Kinshasa",
    "apiName": "Congo - Kinshasa"
  },
  {
    "code": "KP",
    "name": "Coreia do Norte",
    "apiName": "North Korea"
  },
  {
    "code": "KR",
    "name": "Coreia do Sul",
    "apiName": "South Korea"
  },
  {
    "code": "CI",
    "name": "Costa do Marfim",
    "apiName": "Côte d’Ivoire"
  },
  {
    "code": "CR",
    "name": "Costa Rica",
    "apiName": "Costa Rica"
  },
  {
    "code": "HR",
    "name": "Croácia",
    "apiName": "Croatia"
  },
  {
    "code": "CU",
    "name": "Cuba",
    "apiName": "Cuba"
  },
  {
    "code": "CW",
    "name": "Curaçao",
    "apiName": "Curaçao"
  },
  {
    "code": "DK",
    "name": "Dinamarca",
    "apiName": "Denmark"
  },
  {
    "code": "DJ",
    "name": "Djibuti",
    "apiName": "Djibouti"
  },
  {
    "code": "DM",
    "name": "Dominica",
    "apiName": "Dominica"
  },
  {
    "code": "EG",
    "name": "Egito",
    "apiName": "Egypt"
  },
  {
    "code": "SV",
    "name": "El Salvador",
    "apiName": "El Salvador"
  },
  {
    "code": "AE",
    "name": "Emirados Árabes Unidos",
    "apiName": "United Arab Emirates"
  },
  {
    "code": "EC",
    "name": "Equador",
    "apiName": "Ecuador"
  },
  {
    "code": "ER",
    "name": "Eritreia",
    "apiName": "Eritrea"
  },
  {
    "code": "SCO",
    "name": "Escócia",
    "apiName": "Scotland"
  },
  {
    "code": "SK",
    "name": "Eslováquia",
    "apiName": "Slovakia"
  },
  {
    "code": "SI",
    "name": "Eslovênia",
    "apiName": "Slovenia"
  },
  {
    "code": "ES",
    "name": "Espanha",
    "apiName": "Spain"
  },
  {
    "code": "SZ",
    "name": "Essuatíni",
    "apiName": "Eswatini"
  },
  {
    "code": "US",
    "name": "Estados Unidos",
    "apiName": "United States"
  },
  {
    "code": "EE",
    "name": "Estônia",
    "apiName": "Estonia"
  },
  {
    "code": "ET",
    "name": "Etiópia",
    "apiName": "Ethiopia"
  },
  {
    "code": "FJ",
    "name": "Fiji",
    "apiName": "Fiji"
  },
  {
    "code": "PH",
    "name": "Filipinas",
    "apiName": "Philippines"
  },
  {
    "code": "FI",
    "name": "Finlândia",
    "apiName": "Finland"
  },
  {
    "code": "FR",
    "name": "França",
    "apiName": "France"
  },
  {
    "code": "GA",
    "name": "Gabão",
    "apiName": "Gabon"
  },
  {
    "code": "GH",
    "name": "Gana",
    "apiName": "Ghana"
  },
  {
    "code": "GE",
    "name": "Geórgia",
    "apiName": "Georgia"
  },
  {
    "code": "GI",
    "name": "Gibraltar",
    "apiName": "Gibraltar"
  },
  {
    "code": "GD",
    "name": "Granada",
    "apiName": "Grenada"
  },
  {
    "code": "GL",
    "name": "Groenlândia",
    "apiName": "Greenland"
  },
  {
    "code": "GR",
    "name": "Grécia",
    "apiName": "Greece"
  },
  {
    "code": "GP",
    "name": "Guadalupe",
    "apiName": "Guadeloupe"
  },
  {
    "code": "GU",
    "name": "Guam",
    "apiName": "Guam"
  },
  {
    "code": "GT",
    "name": "Guatemala",
    "apiName": "Guatemala"
  },
  {
    "code": "GG",
    "name": "Guernsey",
    "apiName": "Guernsey"
  },
  {
    "code": "GY",
    "name": "Guiana",
    "apiName": "Guyana"
  },
  {
    "code": "GF",
    "name": "Guiana Francesa",
    "apiName": "French Guiana"
  },
  {
    "code": "GN",
    "name": "Guiné",
    "apiName": "Guinea"
  },
  {
    "code": "GQ",
    "name": "Guiné Equatorial",
    "apiName": "Equatorial Guinea"
  },
  {
    "code": "GW",
    "name": "Guiné-Bissau",
    "apiName": "Guinea-Bissau"
  },
  {
    "code": "GM",
    "name": "Gâmbia",
    "apiName": "Gambia"
  },
  {
    "code": "HT",
    "name": "Haiti",
    "apiName": "Haiti"
  },
  {
    "code": "HN",
    "name": "Honduras",
    "apiName": "Honduras"
  },
  {
    "code": "HK",
    "name": "Hong Kong, RAE da China",
    "apiName": "Hong Kong SAR China"
  },
  {
    "code": "HU",
    "name": "Hungria",
    "apiName": "Hungary"
  },
  {
    "code": "BV",
    "name": "Ilha Bouvet",
    "apiName": "Bouvet Island"
  },
  {
    "code": "CX",
    "name": "Ilha Christmas",
    "apiName": "Christmas Island"
  },
  {
    "code": "IM",
    "name": "Ilha de Man",
    "apiName": "Isle of Man"
  },
  {
    "code": "NF",
    "name": "Ilha Norfolk",
    "apiName": "Norfolk Island"
  },
  {
    "code": "AX",
    "name": "Ilhas Aland",
    "apiName": "Åland Islands"
  },
  {
    "code": "KY",
    "name": "Ilhas Cayman",
    "apiName": "Cayman Islands"
  },
  {
    "code": "CC",
    "name": "Ilhas Cocos (Keeling)",
    "apiName": "Cocos (Keeling) Islands"
  },
  {
    "code": "CK",
    "name": "Ilhas Cook",
    "apiName": "Cook Islands"
  },
  {
    "code": "FO",
    "name": "Ilhas Faroé",
    "apiName": "Faroe Islands"
  },
  {
    "code": "GS",
    "name": "Ilhas Geórgia do Sul e Sandwich do Sul",
    "apiName": "South Georgia & South Sandwich Islands"
  },
  {
    "code": "HM",
    "name": "Ilhas Heard e McDonald",
    "apiName": "Heard & McDonald Islands"
  },
  {
    "code": "FK",
    "name": "Ilhas Malvinas",
    "apiName": "Falkland Islands"
  },
  {
    "code": "MP",
    "name": "Ilhas Marianas do Norte",
    "apiName": "Northern Mariana Islands"
  },
  {
    "code": "MH",
    "name": "Ilhas Marshall",
    "apiName": "Marshall Islands"
  },
  {
    "code": "UM",
    "name": "Ilhas Menores Distantes dos EUA",
    "apiName": "U.S. Outlying Islands"
  },
  {
    "code": "PN",
    "name": "Ilhas Pitcairn",
    "apiName": "Pitcairn Islands"
  },
  {
    "code": "SB",
    "name": "Ilhas Salomão",
    "apiName": "Solomon Islands"
  },
  {
    "code": "TC",
    "name": "Ilhas Turcas e Caicos",
    "apiName": "Turks & Caicos Islands"
  },
  {
    "code": "VI",
    "name": "Ilhas Virgens Americanas",
    "apiName": "U.S. Virgin Islands"
  },
  {
    "code": "VG",
    "name": "Ilhas Virgens Britânicas",
    "apiName": "British Virgin Islands"
  },
  {
    "code": "ID",
    "name": "Indonésia",
    "apiName": "Indonesia"
  },
  {
    "code": "ENG",
    "name": "Inglaterra",
    "apiName": "England"
  },
  {
    "code": "IQ",
    "name": "Iraque",
    "apiName": "Iraq"
  },
  {
    "code": "IE",
    "name": "Irlanda",
    "apiName": "Ireland"
  },
  {
    "code": "NIR",
    "name": "Irlanda do Norte",
    "apiName": "Northern Ireland"
  },
  {
    "code": "IR",
    "name": "Irã",
    "apiName": "Iran"
  },
  {
    "code": "IS",
    "name": "Islândia",
    "apiName": "Iceland"
  },
  {
    "code": "IL",
    "name": "Israel",
    "apiName": "Israel"
  },
  {
    "code": "IT",
    "name": "Itália",
    "apiName": "Italy"
  },
  {
    "code": "YE",
    "name": "Iêmen",
    "apiName": "Yemen"
  },
  {
    "code": "JM",
    "name": "Jamaica",
    "apiName": "Jamaica"
  },
  {
    "code": "JP",
    "name": "Japão",
    "apiName": "Japan"
  },
  {
    "code": "JE",
    "name": "Jersey",
    "apiName": "Jersey"
  },
  {
    "code": "JO",
    "name": "Jordânia",
    "apiName": "Jordan"
  },
  {
    "code": "KW",
    "name": "Kuwait",
    "apiName": "Kuwait"
  },
  {
    "code": "LA",
    "name": "Laos",
    "apiName": "Laos"
  },
  {
    "code": "LS",
    "name": "Lesoto",
    "apiName": "Lesotho"
  },
  {
    "code": "LV",
    "name": "Letônia",
    "apiName": "Latvia"
  },
  {
    "code": "LR",
    "name": "Libéria",
    "apiName": "Liberia"
  },
  {
    "code": "LI",
    "name": "Liechtenstein",
    "apiName": "Liechtenstein"
  },
  {
    "code": "LT",
    "name": "Lituânia",
    "apiName": "Lithuania"
  },
  {
    "code": "LU",
    "name": "Luxemburgo",
    "apiName": "Luxembourg"
  },
  {
    "code": "LB",
    "name": "Líbano",
    "apiName": "Lebanon"
  },
  {
    "code": "LY",
    "name": "Líbia",
    "apiName": "Libya"
  },
  {
    "code": "MO",
    "name": "Macau, RAE da China",
    "apiName": "Macao SAR China"
  },
  {
    "code": "MK",
    "name": "Macedônia do Norte",
    "apiName": "North Macedonia"
  },
  {
    "code": "MG",
    "name": "Madagascar",
    "apiName": "Madagascar"
  },
  {
    "code": "MW",
    "name": "Malaui",
    "apiName": "Malawi"
  },
  {
    "code": "MV",
    "name": "Maldivas",
    "apiName": "Maldives"
  },
  {
    "code": "ML",
    "name": "Mali",
    "apiName": "Mali"
  },
  {
    "code": "MT",
    "name": "Malta",
    "apiName": "Malta"
  },
  {
    "code": "MY",
    "name": "Malásia",
    "apiName": "Malaysia"
  },
  {
    "code": "MA",
    "name": "Marrocos",
    "apiName": "Morocco"
  },
  {
    "code": "MQ",
    "name": "Martinica",
    "apiName": "Martinique"
  },
  {
    "code": "MR",
    "name": "Mauritânia",
    "apiName": "Mauritania"
  },
  {
    "code": "MU",
    "name": "Maurício",
    "apiName": "Mauritius"
  },
  {
    "code": "YT",
    "name": "Mayotte",
    "apiName": "Mayotte"
  },
  {
    "code": "MM",
    "name": "Mianmar (Birmânia)",
    "apiName": "Myanmar (Burma)"
  },
  {
    "code": "FM",
    "name": "Micronésia",
    "apiName": "Micronesia"
  },
  {
    "code": "MD",
    "name": "Moldávia",
    "apiName": "Moldova"
  },
  {
    "code": "MN",
    "name": "Mongólia",
    "apiName": "Mongolia"
  },
  {
    "code": "ME",
    "name": "Montenegro",
    "apiName": "Montenegro"
  },
  {
    "code": "MS",
    "name": "Montserrat",
    "apiName": "Montserrat"
  },
  {
    "code": "MZ",
    "name": "Moçambique",
    "apiName": "Mozambique"
  },
  {
    "code": "MX",
    "name": "México",
    "apiName": "Mexico"
  },
  {
    "code": "MC",
    "name": "Mônaco",
    "apiName": "Monaco"
  },
  {
    "code": "NA",
    "name": "Namíbia",
    "apiName": "Namibia"
  },
  {
    "code": "NR",
    "name": "Nauru",
    "apiName": "Nauru"
  },
  {
    "code": "NP",
    "name": "Nepal",
    "apiName": "Nepal"
  },
  {
    "code": "NI",
    "name": "Nicarágua",
    "apiName": "Nicaragua"
  },
  {
    "code": "NG",
    "name": "Nigéria",
    "apiName": "Nigeria"
  },
  {
    "code": "NU",
    "name": "Niue",
    "apiName": "Niue"
  },
  {
    "code": "NO",
    "name": "Noruega",
    "apiName": "Norway"
  },
  {
    "code": "NC",
    "name": "Nova Caledônia",
    "apiName": "New Caledonia"
  },
  {
    "code": "NZ",
    "name": "Nova Zelândia",
    "apiName": "New Zealand"
  },
  {
    "code": "NE",
    "name": "Níger",
    "apiName": "Niger"
  },
  {
    "code": "OM",
    "name": "Omã",
    "apiName": "Oman"
  },
  {
    "code": "PW",
    "name": "Palau",
    "apiName": "Palau"
  },
  {
    "code": "PA",
    "name": "Panamá",
    "apiName": "Panama"
  },
  {
    "code": "PG",
    "name": "Papua-Nova Guiné",
    "apiName": "Papua New Guinea"
  },
  {
    "code": "PK",
    "name": "Paquistão",
    "apiName": "Pakistan"
  },
  {
    "code": "PY",
    "name": "Paraguai",
    "apiName": "Paraguay"
  },
  {
    "code": "WAL",
    "name": "País de Gales",
    "apiName": "Wales"
  },
  {
    "code": "NL",
    "name": "Países Baixos",
    "apiName": "Netherlands"
  },
  {
    "code": "BQ",
    "name": "Países Baixos Caribenhos",
    "apiName": "Caribbean Netherlands"
  },
  {
    "code": "PE",
    "name": "Peru",
    "apiName": "Peru"
  },
  {
    "code": "PF",
    "name": "Polinésia Francesa",
    "apiName": "French Polynesia"
  },
  {
    "code": "PL",
    "name": "Polônia",
    "apiName": "Poland"
  },
  {
    "code": "PR",
    "name": "Porto Rico",
    "apiName": "Puerto Rico"
  },
  {
    "code": "PT",
    "name": "Portugal",
    "apiName": "Portugal"
  },
  {
    "code": "KG",
    "name": "Quirguistão",
    "apiName": "Kyrgyzstan"
  },
  {
    "code": "KI",
    "name": "Quiribati",
    "apiName": "Kiribati"
  },
  {
    "code": "KE",
    "name": "Quênia",
    "apiName": "Kenya"
  },
  {
    "code": "GB",
    "name": "Reino Unido",
    "apiName": "United Kingdom"
  },
  {
    "code": "CF",
    "name": "República Centro-Africana",
    "apiName": "Central African Republic"
  },
  {
    "code": "CG",
    "name": "República do Congo",
    "apiName": "Congo - Brazzaville"
  },
  {
    "code": "DO",
    "name": "República Dominicana",
    "apiName": "Dominican Republic"
  },
  {
    "code": "RE",
    "name": "Reunião",
    "apiName": "Réunion"
  },
  {
    "code": "RO",
    "name": "Romênia",
    "apiName": "Romania"
  },
  {
    "code": "RW",
    "name": "Ruanda",
    "apiName": "Rwanda"
  },
  {
    "code": "RU",
    "name": "Rússia",
    "apiName": "Russia"
  },
  {
    "code": "EH",
    "name": "Saara Ocidental",
    "apiName": "Western Sahara"
  },
  {
    "code": "WS",
    "name": "Samoa",
    "apiName": "Samoa"
  },
  {
    "code": "AS",
    "name": "Samoa Americana",
    "apiName": "American Samoa"
  },
  {
    "code": "SM",
    "name": "San Marino",
    "apiName": "San Marino"
  },
  {
    "code": "SH",
    "name": "Santa Helena",
    "apiName": "St. Helena"
  },
  {
    "code": "LC",
    "name": "Santa Lúcia",
    "apiName": "St. Lucia"
  },
  {
    "code": "SC",
    "name": "Seicheles",
    "apiName": "Seychelles"
  },
  {
    "code": "SN",
    "name": "Senegal",
    "apiName": "Senegal"
  },
  {
    "code": "SL",
    "name": "Serra Leoa",
    "apiName": "Sierra Leone"
  },
  {
    "code": "SG",
    "name": "Singapura",
    "apiName": "Singapore"
  },
  {
    "code": "SX",
    "name": "Sint Maarten",
    "apiName": "Sint Maarten"
  },
  {
    "code": "SO",
    "name": "Somália",
    "apiName": "Somalia"
  },
  {
    "code": "LK",
    "name": "Sri Lanka",
    "apiName": "Sri Lanka"
  },
  {
    "code": "SD",
    "name": "Sudão",
    "apiName": "Sudan"
  },
  {
    "code": "SS",
    "name": "Sudão do Sul",
    "apiName": "South Sudan"
  },
  {
    "code": "SR",
    "name": "Suriname",
    "apiName": "Suriname"
  },
  {
    "code": "SE",
    "name": "Suécia",
    "apiName": "Sweden"
  },
  {
    "code": "CH",
    "name": "Suíça",
    "apiName": "Switzerland"
  },
  {
    "code": "SJ",
    "name": "Svalbard e Jan Mayen",
    "apiName": "Svalbard & Jan Mayen"
  },
  {
    "code": "BL",
    "name": "São Bartolomeu",
    "apiName": "St. Barthélemy"
  },
  {
    "code": "KN",
    "name": "São Cristóvão e Névis",
    "apiName": "St. Kitts & Nevis"
  },
  {
    "code": "MF",
    "name": "São Martinho",
    "apiName": "St. Martin"
  },
  {
    "code": "PM",
    "name": "São Pedro e Miquelão",
    "apiName": "St. Pierre & Miquelon"
  },
  {
    "code": "ST",
    "name": "São Tomé e Príncipe",
    "apiName": "São Tomé & Príncipe"
  },
  {
    "code": "VC",
    "name": "São Vicente e Granadinas",
    "apiName": "St. Vincent & Grenadines"
  },
  {
    "code": "RS",
    "name": "Sérvia",
    "apiName": "Serbia"
  },
  {
    "code": "SY",
    "name": "Síria",
    "apiName": "Syria"
  },
  {
    "code": "TJ",
    "name": "Tadjiquistão",
    "apiName": "Tajikistan"
  },
  {
    "code": "TH",
    "name": "Tailândia",
    "apiName": "Thailand"
  },
  {
    "code": "TW",
    "name": "Taiwan",
    "apiName": "Taiwan"
  },
  {
    "code": "TZ",
    "name": "Tanzânia",
    "apiName": "Tanzania"
  },
  {
    "code": "CZ",
    "name": "Tchéquia",
    "apiName": "Czechia"
  },
  {
    "code": "IO",
    "name": "Território Britânico do Oceano Índico",
    "apiName": "British Indian Ocean Territory"
  },
  {
    "code": "TF",
    "name": "Territórios Franceses do Sul",
    "apiName": "French Southern Territories"
  },
  {
    "code": "PS",
    "name": "Territórios palestinos",
    "apiName": "Palestinian Territories"
  },
  {
    "code": "TL",
    "name": "Timor-Leste",
    "apiName": "Timor-Leste"
  },
  {
    "code": "TG",
    "name": "Togo",
    "apiName": "Togo"
  },
  {
    "code": "TK",
    "name": "Tokelau",
    "apiName": "Tokelau"
  },
  {
    "code": "TO",
    "name": "Tonga",
    "apiName": "Tonga"
  },
  {
    "code": "TT",
    "name": "Trinidad e Tobago",
    "apiName": "Trinidad & Tobago"
  },
  {
    "code": "TN",
    "name": "Tunísia",
    "apiName": "Tunisia"
  },
  {
    "code": "TM",
    "name": "Turcomenistão",
    "apiName": "Turkmenistan"
  },
  {
    "code": "TR",
    "name": "Turquia",
    "apiName": "Türkiye"
  },
  {
    "code": "TV",
    "name": "Tuvalu",
    "apiName": "Tuvalu"
  },
  {
    "code": "UA",
    "name": "Ucrânia",
    "apiName": "Ukraine"
  },
  {
    "code": "UG",
    "name": "Uganda",
    "apiName": "Uganda"
  },
  {
    "code": "UY",
    "name": "Uruguai",
    "apiName": "Uruguay"
  },
  {
    "code": "UZ",
    "name": "Uzbequistão",
    "apiName": "Uzbekistan"
  },
  {
    "code": "VU",
    "name": "Vanuatu",
    "apiName": "Vanuatu"
  },
  {
    "code": "VE",
    "name": "Venezuela",
    "apiName": "Venezuela"
  },
  {
    "code": "VN",
    "name": "Vietnã",
    "apiName": "Vietnam"
  },
  {
    "code": "WF",
    "name": "Wallis e Futuna",
    "apiName": "Wallis & Futuna"
  },
  {
    "code": "ZW",
    "name": "Zimbábue",
    "apiName": "Zimbabwe"
  },
  {
    "code": "ZM",
    "name": "Zâmbia",
    "apiName": "Zambia"
  },
  {
    "code": "ZA",
    "name": "África do Sul",
    "apiName": "South Africa"
  },
  {
    "code": "AT",
    "name": "Áustria",
    "apiName": "Austria"
  },
  {
    "code": "IN",
    "name": "Índia",
    "apiName": "India"
  }
];

const LOCAL_CLUBS = {
  "BR": [
    {
      "name": "Atlético Mineiro",
      "strength": 81
    },
    {
      "name": "Bahia",
      "strength": 77
    },
    {
      "name": "Botafogo",
      "strength": 82
    },
    {
      "name": "Corinthians",
      "strength": 79
    },
    {
      "name": "Cruzeiro",
      "strength": 80
    },
    {
      "name": "Flamengo",
      "strength": 86
    },
    {
      "name": "Fluminense",
      "strength": 80
    },
    {
      "name": "Grêmio",
      "strength": 79
    },
    {
      "name": "Internacional",
      "strength": 80
    },
    {
      "name": "Palmeiras",
      "strength": 86
    },
    {
      "name": "Santos",
      "strength": 77
    },
    {
      "name": "São Paulo",
      "strength": 82
    }
  ],
  "AR": [
    {
      "name": "Argentinos Juniors",
      "strength": 75
    },
    {
      "name": "Boca Juniors",
      "strength": 83
    },
    {
      "name": "Estudiantes",
      "strength": 78
    },
    {
      "name": "Independiente",
      "strength": 77
    },
    {
      "name": "Racing Club",
      "strength": 80
    },
    {
      "name": "River Plate",
      "strength": 85
    },
    {
      "name": "Rosario Central",
      "strength": 77
    },
    {
      "name": "San Lorenzo",
      "strength": 77
    },
    {
      "name": "Talleres",
      "strength": 79
    },
    {
      "name": "Vélez Sarsfield",
      "strength": 78
    }
  ],
  "ES": [
    {
      "name": "Athletic Club",
      "strength": 82
    },
    {
      "name": "Atlético de Madrid",
      "strength": 88
    },
    {
      "name": "Barcelona",
      "strength": 92
    },
    {
      "name": "Betis",
      "strength": 81
    },
    {
      "name": "Girona",
      "strength": 80
    },
    {
      "name": "Real Madrid",
      "strength": 93
    },
    {
      "name": "Real Sociedad",
      "strength": 82
    },
    {
      "name": "Sevilla",
      "strength": 80
    },
    {
      "name": "Valencia",
      "strength": 79
    },
    {
      "name": "Villarreal",
      "strength": 82
    }
  ],
  "ENG": [
    {
      "name": "Arsenal",
      "strength": 90
    },
    {
      "name": "Aston Villa",
      "strength": 84
    },
    {
      "name": "Chelsea",
      "strength": 87
    },
    {
      "name": "Liverpool",
      "strength": 91
    },
    {
      "name": "Manchester City",
      "strength": 92
    },
    {
      "name": "Manchester United",
      "strength": 86
    },
    {
      "name": "Newcastle United",
      "strength": 85
    },
    {
      "name": "Nottingham Forest",
      "strength": 81
    },
    {
      "name": "Tottenham",
      "strength": 85
    },
    {
      "name": "West Ham",
      "strength": 80
    }
  ],
  "GB": [
    {
      "name": "Arsenal",
      "strength": 90
    },
    {
      "name": "Liverpool",
      "strength": 91
    },
    {
      "name": "Manchester City",
      "strength": 92
    },
    {
      "name": "Celtic",
      "strength": 82
    },
    {
      "name": "Rangers",
      "strength": 81
    },
    {
      "name": "Chelsea",
      "strength": 87
    }
  ],
  "DE": [
    {
      "name": "Bayern de Munique",
      "strength": 91
    },
    {
      "name": "Bayer Leverkusen",
      "strength": 88
    },
    {
      "name": "Borussia Dortmund",
      "strength": 87
    },
    {
      "name": "Eintracht Frankfurt",
      "strength": 82
    },
    {
      "name": "RB Leipzig",
      "strength": 85
    },
    {
      "name": "Stuttgart",
      "strength": 82
    },
    {
      "name": "Werder Bremen",
      "strength": 78
    }
  ],
  "IT": [
    {
      "name": "Atalanta",
      "strength": 86
    },
    {
      "name": "Fiorentina",
      "strength": 82
    },
    {
      "name": "Inter de Milão",
      "strength": 91
    },
    {
      "name": "Juventus",
      "strength": 88
    },
    {
      "name": "Lazio",
      "strength": 83
    },
    {
      "name": "Milan",
      "strength": 88
    },
    {
      "name": "Napoli",
      "strength": 87
    },
    {
      "name": "Roma",
      "strength": 85
    }
  ],
  "FR": [
    {
      "name": "Lille",
      "strength": 82
    },
    {
      "name": "Lyon",
      "strength": 81
    },
    {
      "name": "Marseille",
      "strength": 84
    },
    {
      "name": "Monaco",
      "strength": 85
    },
    {
      "name": "Nice",
      "strength": 81
    },
    {
      "name": "Paris Saint-Germain",
      "strength": 92
    },
    {
      "name": "Rennes",
      "strength": 80
    }
  ],
  "PT": [
    {
      "name": "Benfica",
      "strength": 87
    },
    {
      "name": "Braga",
      "strength": 81
    },
    {
      "name": "Porto",
      "strength": 86
    },
    {
      "name": "Sporting CP",
      "strength": 87
    },
    {
      "name": "Vitória de Guimarães",
      "strength": 78
    }
  ],
  "NL": [
    {
      "name": "Ajax",
      "strength": 83
    },
    {
      "name": "AZ Alkmaar",
      "strength": 80
    },
    {
      "name": "Feyenoord",
      "strength": 85
    },
    {
      "name": "PSV",
      "strength": 86
    },
    {
      "name": "Twente",
      "strength": 79
    }
  ],
  "BE": [
    {
      "name": "Anderlecht",
      "strength": 80
    },
    {
      "name": "Club Brugge",
      "strength": 83
    },
    {
      "name": "Genk",
      "strength": 80
    },
    {
      "name": "Gent",
      "strength": 79
    },
    {
      "name": "Union Saint-Gilloise",
      "strength": 82
    }
  ],
  "TR": [
    {
      "name": "Beşiktaş",
      "strength": 80
    },
    {
      "name": "Fenerbahçe",
      "strength": 84
    },
    {
      "name": "Galatasaray",
      "strength": 85
    },
    {
      "name": "İstanbul Başakşehir",
      "strength": 78
    },
    {
      "name": "Trabzonspor",
      "strength": 79
    }
  ],
  "MX": [
    {
      "name": "América",
      "strength": 82
    },
    {
      "name": "Cruz Azul",
      "strength": 80
    },
    {
      "name": "Guadalajara",
      "strength": 79
    },
    {
      "name": "Monterrey",
      "strength": 82
    },
    {
      "name": "Tigres UANL",
      "strength": 82
    }
  ],
  "US": [
    {
      "name": "Atlanta United",
      "strength": 76
    },
    {
      "name": "Inter Miami",
      "strength": 81
    },
    {
      "name": "LA Galaxy",
      "strength": 79
    },
    {
      "name": "Los Angeles FC",
      "strength": 80
    },
    {
      "name": "Seattle Sounders",
      "strength": 79
    }
  ],
  "JP": [
    {
      "name": "Kashima Antlers",
      "strength": 77
    },
    {
      "name": "Kawasaki Frontale",
      "strength": 78
    },
    {
      "name": "Urawa Red Diamonds",
      "strength": 79
    },
    {
      "name": "Vissel Kobe",
      "strength": 79
    },
    {
      "name": "Yokohama F. Marinos",
      "strength": 78
    }
  ],
  "SA": [
    {
      "name": "Al-Ahli",
      "strength": 82
    },
    {
      "name": "Al-Hilal",
      "strength": 87
    },
    {
      "name": "Al-Ittihad",
      "strength": 85
    },
    {
      "name": "Al-Nassr",
      "strength": 86
    },
    {
      "name": "Al-Shabab",
      "strength": 79
    }
  ],
  "UY": [
    {
      "name": "Danubio",
      "strength": 73
    },
    {
      "name": "Defensor Sporting",
      "strength": 74
    },
    {
      "name": "Nacional",
      "strength": 79
    },
    {
      "name": "Peñarol",
      "strength": 79
    },
    {
      "name": "Liverpool Montevideo",
      "strength": 73
    }
  ],
  "CO": [
    {
      "name": "Atlético Nacional",
      "strength": 79
    },
    {
      "name": "Junior",
      "strength": 76
    },
    {
      "name": "Millonarios",
      "strength": 77
    },
    {
      "name": "América de Cali",
      "strength": 76
    },
    {
      "name": "Independiente Medellín",
      "strength": 76
    }
  ],
  "CL": [
    {
      "name": "Colo-Colo",
      "strength": 78
    },
    {
      "name": "Universidad Católica",
      "strength": 75
    },
    {
      "name": "Universidad de Chile",
      "strength": 76
    },
    {
      "name": "Huachipato",
      "strength": 73
    },
    {
      "name": "Palestino",
      "strength": 73
    }
  ]
};

const COMPETITION_RULES = {
  "BR": {
    "league": "Brasileirão Série A",
    "cup": "Copa do Brasil",
    "continental": [
      "CONMEBOL Libertadores",
      "CONMEBOL Sul-Americana"
    ]
  },
  "AR": {
    "league": "Liga Profesional Argentina",
    "cup": "Copa Argentina",
    "continental": [
      "CONMEBOL Libertadores",
      "CONMEBOL Sul-Americana"
    ]
  },
  "UY": {
    "league": "Primera División Uruguaia",
    "cup": "Copa AUF Uruguay",
    "continental": [
      "CONMEBOL Libertadores",
      "CONMEBOL Sul-Americana"
    ]
  },
  "CO": {
    "league": "Categoría Primera A",
    "cup": "Copa Colombia",
    "continental": [
      "CONMEBOL Libertadores",
      "CONMEBOL Sul-Americana"
    ]
  },
  "CL": {
    "league": "Primera División do Chile",
    "cup": "Copa Chile",
    "continental": [
      "CONMEBOL Libertadores",
      "CONMEBOL Sul-Americana"
    ]
  },
  "ES": {
    "league": "LaLiga",
    "cup": "Copa do Rei",
    "continental": [
      "UEFA Champions League",
      "UEFA Europa League",
      "UEFA Conference League"
    ]
  },
  "ENG": {
    "league": "Premier League",
    "cup": "FA Cup",
    "continental": [
      "UEFA Champions League",
      "UEFA Europa League",
      "UEFA Conference League"
    ]
  },
  "GB": {
    "league": "Premier League / Premiership",
    "cup": "Copa Nacional",
    "continental": [
      "UEFA Champions League",
      "UEFA Europa League",
      "UEFA Conference League"
    ]
  },
  "DE": {
    "league": "Bundesliga",
    "cup": "DFB-Pokal",
    "continental": [
      "UEFA Champions League",
      "UEFA Europa League",
      "UEFA Conference League"
    ]
  },
  "IT": {
    "league": "Serie A",
    "cup": "Coppa Italia",
    "continental": [
      "UEFA Champions League",
      "UEFA Europa League",
      "UEFA Conference League"
    ]
  },
  "FR": {
    "league": "Ligue 1",
    "cup": "Coupe de France",
    "continental": [
      "UEFA Champions League",
      "UEFA Europa League",
      "UEFA Conference League"
    ]
  },
  "PT": {
    "league": "Primeira Liga",
    "cup": "Taça de Portugal",
    "continental": [
      "UEFA Champions League",
      "UEFA Europa League",
      "UEFA Conference League"
    ]
  },
  "NL": {
    "league": "Eredivisie",
    "cup": "KNVB Beker",
    "continental": [
      "UEFA Champions League",
      "UEFA Europa League",
      "UEFA Conference League"
    ]
  },
  "BE": {
    "league": "Belgian Pro League",
    "cup": "Copa da Bélgica",
    "continental": [
      "UEFA Champions League",
      "UEFA Europa League",
      "UEFA Conference League"
    ]
  },
  "TR": {
    "league": "Süper Lig",
    "cup": "Copa da Turquia",
    "continental": [
      "UEFA Champions League",
      "UEFA Europa League",
      "UEFA Conference League"
    ]
  },
  "MX": {
    "league": "Liga MX",
    "cup": "Copa Nacional",
    "continental": [
      "CONCACAF Champions Cup"
    ]
  },
  "US": {
    "league": "Major League Soccer",
    "cup": "U.S. Open Cup",
    "continental": [
      "CONCACAF Champions Cup"
    ]
  },
  "JP": {
    "league": "J1 League",
    "cup": "Copa do Imperador",
    "continental": [
      "AFC Champions League Elite",
      "AFC Champions League Two"
    ]
  },
  "SA": {
    "league": "Saudi Pro League",
    "cup": "King Cup",
    "continental": [
      "AFC Champions League Elite",
      "AFC Champions League Two"
    ]
  }
};

const CONFEDERATIONS = {
  southAmerica: ["AR", "BO", "BR", "CL", "CO", "EC", "GY", "PE", "PY", "SR", "UY", "VE"],
  europe: ["AD", "AL", "AT", "BA", "BE", "BG", "BY", "CH", "CY", "CZ", "DE", "DK", "EE", "ENG", "ES", "FI", "FR", "GB", "GR", "HR", "HU", "IE", "IS", "IT", "LI", "LT", "LU", "LV", "MC", "MD", "ME", "MK", "MT", "NIR", "NL", "NO", "PL", "PT", "RO", "RS", "RU", "SCO", "SE", "SI", "SK", "SM", "UA", "VA", "WAL"],
  concacaf: ["AG", "BB", "BS", "BZ", "CA", "CR", "CU", "DM", "DO", "GD", "GT", "HN", "HT", "JM", "KN", "LC", "MX", "NI", "PA", "SV", "TT", "US", "VC"],
  asia: ["AE", "AF", "AM", "AZ", "BD", "BH", "BN", "BT", "CN", "GE", "ID", "IL", "IN", "IQ", "IR", "JO", "JP", "KG", "KH", "KP", "KR", "KW", "KZ", "LA", "LB", "LK", "MM", "MN", "MV", "MY", "NP", "OM", "PH", "PK", "PS", "QA", "SA", "SG", "SY", "TH", "TJ", "TL", "TM", "UZ", "VN", "YE"],
  africa: ["AO", "BF", "BI", "BJ", "BW", "CD", "CF", "CG", "CI", "CM", "CV", "DJ", "DZ", "EG", "ER", "ET", "GA", "GH", "GM", "GN", "GQ", "GW", "KE", "KM", "LR", "LS", "LY", "MA", "MG", "ML", "MR", "MU", "MW", "MZ", "NA", "NE", "NG", "RW", "SC", "SD", "SL", "SN", "SO", "SS", "ST", "SZ", "TD", "TG", "TN", "TZ", "UG", "ZA", "ZM", "ZW"],
  oceania: ["AU", "FJ", "FM", "KI", "MH", "NR", "NZ", "PG", "PW", "SB", "TO", "TV", "VU", "WS"]
};

const POSITIONS = [
  'Goleiro','Zagueiro','Lateral direito','Lateral esquerdo','Volante','Meia central','Meia ofensivo','Meia direita','Meia esquerda','Segundo atacante','Ponta direita','Ponta esquerda','Centroavante'
];

const START_YEAR = new Date().getFullYear();
