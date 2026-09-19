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

// --- CareerSim V3: formatos, mercado, temas e eventos ---
const LEAGUE_FORMATS = {
  BR:{teams:20,matches:38,mode:'double_round_robin',championPoints:80,label:'20 clubes · 38 rodadas · 19 em casa e 19 fora'},
  ES:{teams:20,matches:38,mode:'double_round_robin',championPoints:82,label:'20 clubes · 38 rodadas · turno e returno'},
  ENG:{teams:20,matches:38,mode:'double_round_robin',championPoints:84,label:'20 clubes · 38 rodadas · turno e returno'},
  IT:{teams:20,matches:38,mode:'double_round_robin',championPoints:82,label:'20 clubes · 38 rodadas · turno e returno'},
  DE:{teams:18,matches:34,mode:'double_round_robin',championPoints:73,label:'18 clubes · 34 rodadas · turno e returno'},
  FR:{teams:18,matches:34,mode:'double_round_robin',championPoints:74,label:'18 clubes · 34 rodadas · turno e returno'},
  PT:{teams:18,matches:34,mode:'double_round_robin',championPoints:77,label:'18 clubes · 34 rodadas · turno e returno'},
  NL:{teams:18,matches:34,mode:'double_round_robin',championPoints:77,label:'18 clubes · 34 rodadas · turno e returno'},
  BE:{teams:18,matches:34,mode:'double_round_robin',championPoints:72,label:'18 clubes · fase regular em turno e returno (play-off simplificado)'},
  TR:{teams:18,matches:34,mode:'double_round_robin',championPoints:74,label:'18 clubes · 34 rodadas · turno e returno'},
  SA:{teams:18,matches:34,mode:'double_round_robin',championPoints:74,label:'18 clubes · 34 rodadas · turno e returno'},
  JP:{teams:20,matches:38,mode:'double_round_robin',championPoints:72,label:'20 clubes · turno e returno (modelo padrão da J1)'},
  MX:{teams:18,matches:34,mode:'split_season',championPoints:66,label:'Apertura + Clausura, 17 partidas em cada fase (play-offs simplificados)'},
  US:{teams:30,matches:34,mode:'regional',championPoints:67,label:'34 jogos de temporada regular + playoffs simplificados'},
  AR:{teams:30,matches:32,mode:'groups',championPoints:62,label:'zonas + mata-mata, adaptado para a simulação anual'},
  UY:{teams:16,matches:30,mode:'double_round_robin',championPoints:61,label:'16 clubes · 30 jogos no modelo anual simplificado'},
  CO:{teams:20,matches:38,mode:'split_season',championPoints:70,label:'Apertura + Finalización, adaptados para 38 jogos regulares'},
  CL:{teams:16,matches:30,mode:'double_round_robin',championPoints:60,label:'16 clubes · 30 rodadas · turno e returno'},
  GB:{teams:12,matches:38,mode:'split',championPoints:78,label:'fase regular + divisão em grupos, modelo simplificado'}
};

const LEAGUE_CLUB_POOLS = {
  BR:['Athletico Paranaense','Atlético Mineiro','Bahia','Botafogo','Chapecoense','Corinthians','Coritiba','Cruzeiro','Flamengo','Fluminense','Grêmio','Internacional','Mirassol','Palmeiras','Red Bull Bragantino','Remo','Santos','São Paulo','Vasco da Gama','Vitória'],
  ES:['Athletic Club','Atlético de Madrid','Barcelona','Real Betis','Celta de Vigo','Deportivo La Coruña','Espanyol','Getafe','Levante','Málaga','Osasuna','Racing Santander','Rayo Vallecano','Real Madrid','Real Sociedad','Sevilla','Valencia','Villarreal','Alavés','Elche'],
  ENG:['Arsenal','Aston Villa','Bournemouth','Brentford','Brighton','Chelsea','Coventry City','Crystal Palace','Everton','Fulham','Hull City','Ipswich Town','Leeds United','Liverpool','Manchester City','Manchester United','Newcastle United','Nottingham Forest','Sunderland','Tottenham'],
  DE:['Bayern de Munique','Borussia Dortmund','RB Leipzig','Bayer Leverkusen','Eintracht Frankfurt','Stuttgart','Wolfsburg','Freiburg','Mainz','Werder Bremen','Borussia Mönchengladbach','Hoffenheim','Augsburg','Union Berlin','Hamburgo','Köln','St. Pauli','Heidenheim'],
  IT:['Inter de Milão','Milan','Juventus','Napoli','Roma','Lazio','Atalanta','Fiorentina','Bologna','Torino','Udinese','Genoa','Cagliari','Parma','Lecce','Como','Verona','Sassuolo','Pisa','Cremonese'],
  FR:['Paris Saint-Germain','Marseille','Monaco','Lyon','Lille','Nice','Lens','Rennes','Strasbourg','Toulouse','Nantes','Auxerre','Angers','Brest','Le Havre','Metz','Lorient','Paris FC'],
  PT:['Benfica','Porto','Sporting CP','Braga','Vitória de Guimarães','Boavista','Famalicão','Rio Ave','Moreirense','Casa Pia','Estoril','Arouca','Gil Vicente','Santa Clara','Nacional','AVS','Alverca','Tondela'],
  NL:['Ajax','PSV','Feyenoord','AZ Alkmaar','Twente','Utrecht','Heerenveen','Sparta Rotterdam','Groningen','NEC','Go Ahead Eagles','Heracles','Fortuna Sittard','PEC Zwolle','NAC Breda','Excelsior','Volendam','Telstar'],
  SA:['Al-Hilal','Al-Nassr','Al-Ittihad','Al-Ahli','Al-Ettifaq','Al-Shabab','Al-Taawoun','Al-Fateh','Damac','Al-Fayha','Al-Khaleej','Al-Raed','Al-Riyadh','Al-Wehda','Al-Okhdood','Al-Qadsiah','Al-Kholood','Neom SC']
};

const DOMESTIC_CUP_FORMATS = {
  BR:{stages:[{name:'5ª fase',legs:2},{name:'Oitavas de final',legs:2},{name:'Quartas de final',legs:2},{name:'Semifinal',legs:2},{name:'Final',legs:1}]},
  ES:{stages:[{name:'Fase inicial',legs:1},{name:'Oitavas de final',legs:1},{name:'Quartas de final',legs:1},{name:'Semifinal',legs:2},{name:'Final',legs:1}]},
  ENG:{stages:[{name:'3ª fase',legs:1},{name:'4ª fase',legs:1},{name:'Oitavas de final',legs:1},{name:'Quartas de final',legs:1},{name:'Semifinal',legs:1},{name:'Final',legs:1}]},
  DE:{stages:[{name:'2ª fase',legs:1},{name:'Oitavas de final',legs:1},{name:'Quartas de final',legs:1},{name:'Semifinal',legs:1},{name:'Final',legs:1}]},
  FR:{stages:[{name:'32-avos',legs:1},{name:'16-avos',legs:1},{name:'Oitavas de final',legs:1},{name:'Quartas de final',legs:1},{name:'Semifinal',legs:1},{name:'Final',legs:1}]},
  PT:{stages:[{name:'3ª eliminatória',legs:1},{name:'4ª eliminatória',legs:1},{name:'Oitavas de final',legs:1},{name:'Quartas de final',legs:1},{name:'Semifinal',legs:2},{name:'Final',legs:1}]}
};

const CONTINENTAL_FORMATS = {
  'UEFA Champions League':{phaseMatches:8,phase:'Fase de liga',qualifyPoints:10,directPoints:15,knockout:[{name:'Play-off',legs:2,conditional:true},{name:'Oitavas de final',legs:2},{name:'Quartas de final',legs:2},{name:'Semifinal',legs:2},{name:'Final',legs:1}]},
  'UEFA Europa League':{phaseMatches:8,phase:'Fase de liga',qualifyPoints:9,directPoints:14,knockout:[{name:'Play-off',legs:2,conditional:true},{name:'Oitavas de final',legs:2},{name:'Quartas de final',legs:2},{name:'Semifinal',legs:2},{name:'Final',legs:1}]},
  'UEFA Conference League':{phaseMatches:6,phase:'Fase de liga',qualifyPoints:7,directPoints:12,knockout:[{name:'Play-off',legs:2,conditional:true},{name:'Oitavas de final',legs:2},{name:'Quartas de final',legs:2},{name:'Semifinal',legs:2},{name:'Final',legs:1}]},
  'CONMEBOL Libertadores':{phaseMatches:6,phase:'Fase de grupos',qualifyPoints:9,directPoints:9,knockout:[{name:'Oitavas de final',legs:2},{name:'Quartas de final',legs:2},{name:'Semifinal',legs:2},{name:'Final',legs:1}]},
  'CONMEBOL Sul-Americana':{phaseMatches:6,phase:'Fase de grupos',qualifyPoints:9,directPoints:12,knockout:[{name:'Play-off',legs:2,conditional:true},{name:'Oitavas de final',legs:2},{name:'Quartas de final',legs:2},{name:'Semifinal',legs:2},{name:'Final',legs:1}]},
  'CONCACAF Champions Cup':{phaseMatches:0,phase:'Mata-mata',qualifyPoints:0,directPoints:0,knockout:[{name:'Primeira fase',legs:2},{name:'Oitavas de final',legs:2},{name:'Quartas de final',legs:2},{name:'Semifinal',legs:2},{name:'Final',legs:1}]},
  'AFC Champions League Elite':{phaseMatches:8,phase:'Fase de liga',qualifyPoints:10,directPoints:10,knockout:[{name:'Oitavas de final',legs:2},{name:'Quartas de final',legs:1},{name:'Semifinal',legs:1},{name:'Final',legs:1}]},
  'AFC Champions League Two':{phaseMatches:6,phase:'Fase de grupos',qualifyPoints:9,directPoints:9,knockout:[{name:'Oitavas de final',legs:2},{name:'Quartas de final',legs:2},{name:'Semifinal',legs:2},{name:'Final',legs:1}]}
};

const TRANSFER_TARGETS = [
  {name:'Braga',countryCode:'PT',minOverall:72,strength:78},{name:'Ajax',countryCode:'NL',minOverall:73,strength:82},
  {name:'Benfica',countryCode:'PT',minOverall:75,strength:84},{name:'Porto',countryCode:'PT',minOverall:76,strength:84},{name:'Sporting CP',countryCode:'PT',minOverall:77,strength:85},
  {name:'Borussia Dortmund',countryCode:'DE',minOverall:80,strength:87},{name:'Napoli',countryCode:'IT',minOverall:81,strength:87},{name:'Atlético de Madrid',countryCode:'ES',minOverall:82,strength:88},
  {name:'Arsenal',countryCode:'ENG',minOverall:84,strength:89},{name:'Chelsea',countryCode:'ENG',minOverall:85,strength:88},{name:'Liverpool',countryCode:'ENG',minOverall:86,strength:91},{name:'Manchester City',countryCode:'ENG',minOverall:87,strength:92},
  {name:'Inter de Milão',countryCode:'IT',minOverall:86,strength:90},{name:'Paris Saint-Germain',countryCode:'FR',minOverall:87,strength:91},
  {name:'Bayern de Munique',countryCode:'DE',minOverall:90,strength:93},{name:'Barcelona',countryCode:'ES',minOverall:90,strength:93},{name:'Real Madrid',countryCode:'ES',minOverall:91,strength:94}
];

const CLUB_THEMES = {
  'Santos':{accent:'#f4f4f4',bg:'#070707',panel:'#111111',panel2:'#191919',border:'#343434'},
  'Cruzeiro':{accent:'#68a7ff',bg:'#06142b',panel:'#0b2346',panel2:'#11315f',border:'#244d82'},
  'Chelsea':{accent:'#6aa8ff',bg:'#06142e',panel:'#0b2350',panel2:'#103168',border:'#21477e'},
  'Barcelona':{accent:'#f5c84b',bg:'#170715',panel:'#28102b',panel2:'#361542',border:'#5c265f'},
  'Real Madrid':{accent:'#d6c7ff',bg:'#111018',panel:'#1c1a28',panel2:'#272338',border:'#443d5c'},
  'Bayern de Munique':{accent:'#ff6f7a',bg:'#21080d',panel:'#341016',panel2:'#48151d',border:'#6c2630'},
  'Benfica':{accent:'#ff6d6d',bg:'#220909',panel:'#351010',panel2:'#481717',border:'#6b2929'},
  'Flamengo':{accent:'#ff5151',bg:'#160707',panel:'#290b0b',panel2:'#3b1010',border:'#5e2020'},
  'Palmeiras':{accent:'#65e69a',bg:'#06170f',panel:'#0b281b',panel2:'#103a27',border:'#245c42'},
  'Grêmio':{accent:'#69c9ff',bg:'#071722',panel:'#0c2838',panel2:'#113b52',border:'#285d78'},
  'Internacional':{accent:'#ff6a6a',bg:'#200808',panel:'#330d0d',panel2:'#481313',border:'#702727'},
  'Manchester City':{accent:'#89d7ff',bg:'#071b25',panel:'#0d2b39',panel2:'#123e50',border:'#2b6074'},
  'Liverpool':{accent:'#ff6b6b',bg:'#1d0909',panel:'#310e0e',panel2:'#451515',border:'#6d2727'},
  'Arsenal':{accent:'#ff7171',bg:'#21090d',panel:'#350f16',panel2:'#491620',border:'#6c2934'},
  'Paris Saint-Germain':{accent:'#ff6c78',bg:'#07132b',panel:'#0c2148',panel2:'#11305f',border:'#294d7d'},
  'Ajax':{accent:'#ff7171',bg:'#1e0a0a',panel:'#321010',panel2:'#461717',border:'#692b2b'},
  'Porto':{accent:'#74a9ff',bg:'#07152b',panel:'#0c2247',panel2:'#12325f',border:'#28517e'}
};

const CAREER_EVENTS = [
  {id:'training',title:'Semana livre para treinar',description:'O treinador oferece uma sessão extra. Você pode forçar o desenvolvimento ou preservar o físico.',choices:[
    {label:'Treinar forte',action:'train_hard',effect:'+ chance de evolução; - moral se der errado'},
    {label:'Focar em recuperação',action:'recover',effect:'+ moral e consistência'}]},
  {id:'media',title:'Entrevista após boa atuação',description:'A imprensa pergunta onde você pretende chegar na carreira.',choices:[
    {label:'“Quero ser o melhor do mundo.”',action:'ambitious',effect:'+ reputação; + pressão'},
    {label:'“Só penso no próximo jogo.”',action:'humble',effect:'+ moral; evolução mais estável'}]},
  {id:'coach',title:'Conversa com o treinador',description:'A comissão técnica quer saber se você deseja assumir mais responsabilidade dentro do time.',choices:[
    {label:'Pedir protagonismo',action:'leadership',effect:'+ reputação; pequena chance de +GER'},
    {label:'Continuar aprendendo',action:'learn',effect:'+ potencial se ainda for jovem'}]},
  {id:'agent',title:'Seu empresário traz uma decisão',description:'Há interesse de clubes, mas uma mudança de postura pode afetar seu futuro.',choices:[
    {label:'Buscar um salto na carreira',action:'market_push',effect:'+ chance de receber mais propostas'},
    {label:'Priorizar estabilidade',action:'stability',effect:'+ moral no clube atual'}]},
  {id:'fatigue',title:'Sequência pesada de jogos',description:'Você sente o desgaste do calendário e precisa decidir como lidar com a próxima semana.',choices:[
    {label:'Jogar mesmo cansado',action:'play_tired',effect:'risco de queda de moral; + reputação'},
    {label:'Pedir descanso',action:'rest',effect:'+ moral; sem bônus de reputação'}]}
];