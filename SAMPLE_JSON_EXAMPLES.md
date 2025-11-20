# Sample JSON Examples for Form Submissions

## DIPENDENTE (Employee) Form Submission

**Endpoint:** `POST /api/forms/dipendente`

**Sample JSON:**
```json
{
  "nome": "Mario",
  "cognome": "Rossi",
  "mail": "mario.rossi@email.it",
  "telefono": "+39 333 123 4567",
  "meseNascita": "05",
  "annoNascita": "1985",
  "amount": 30000,
  "salary": 1800,
  "tipo": "PRIVATO",
  "contratto": "INDETERMINATO",
  "numDipendenti": "150",
  "dataAssunzione": "2018-03-15",
  "tfr": "SI",
  "userPosition": "DIPENDENTE",
  "submittedAt": "2025-01-15T14:32:18.123Z"
}
```

**Data Types:**
- `amount`: **number** (30000, not "30000")
- `salary`: **number** (1800, not "1800")
- `numDipendenti`: **string** ("150")
- All other fields: **string**

**Alternative DIPENDENTE example (PUBBLICO/STATALE - no numDipendenti, no TFR):**
```json
{
  "nome": "Giulia",
  "cognome": "Bianchi",
  "mail": "giulia.bianchi@email.it",
  "telefono": "+39 340 987 6543",
  "meseNascita": "09",
  "annoNascita": "1990",
  "amount": 25000,
  "salary": 2200,
  "tipo": "PUBBLICO/STATALE",
  "contratto": "INDETERMINATO",
  "numDipendenti": null,
  "dataAssunzione": "2020-06-01",
  "tfr": null,
  "userPosition": "DIPENDENTE",
  "submittedAt": "2025-01-15T16:45:22.456Z"
}
```

**Data Types:**
- `amount`: **number** (25000)
- `salary`: **number** (2200)
- `numDipendenti`: **null** (not required for PUBBLICO/STATALE)
- `tfr`: **null** (not required for PUBBLICO/STATALE)
- All other fields: **string**

---

## PENSIONATO (Retiree) Form Submission

**Endpoint:** `POST /api/forms/quinto-pensionati-leads`

**Sample JSON:**
```json
{
  "nome": "Luigi",
  "cognome": "Verdi",
  "mail": "luigi.verdi@email.it",
  "telefono": "+39 335 555 1234",
  "meseNascita": "12",
  "annoNascita": "1955",
  "amount": 25000,
  "pension": 1200,
  "tipo": "PENSIONE DI VECCHIAIA",
  "ente": "INPS",
  "userPosition": "PENSIONATO",
  "submittedAt": "2025-01-15T10:15:30.789Z"
}
```

**Data Types:**
- `amount`: **number** (25000, not "25000")
- `pension`: **number** (1200, not "1200")
- All other fields: **string**

**Alternative PENSIONATO example:**
```json
{
  "nome": "Anna",
  "cognome": "Neri",
  "mail": "anna.neri@email.it",
  "telefono": "+39 366 777 8888",
  "meseNascita": "03",
  "annoNascita": "1960",
  "amount": 20000,
  "pension": 1500,
  "tipo": "PENSIONE DI ANZIANITA'",
  "ente": "EX INPDAP",
  "userPosition": "PENSIONATO",
  "submittedAt": "2025-01-15T11:20:45.012Z"
}
```

**Data Types:**
- `amount`: **number** (20000)
- `pension`: **number** (1500)
- All other fields: **string**

---

## Field Descriptions

### Common Fields (Both Types)
- `nome`: First name (**string**, min 2 characters)
- `cognome`: Last name (**string**, min 2 characters)
- `mail`: Email address (**string**, valid email format)
- `telefono`: Phone number (**string**, min 10 characters)
- `meseNascita`: Birth month (**string**, "01" to "12")
- `annoNascita`: Birth year (**string**, 4 digits, e.g., "1985")
- `amount`: Requested loan amount (**number**, e.g., 25000) ⚠️ **NOT a string**
- `userPosition`: User type (**string**, "DIPENDENTE" or "PENSIONATO")
- `submittedAt`: ISO 8601 timestamp (**string**, e.g., "2025-01-15T14:32:18.123Z")

### DIPENDENTE Specific Fields
- `salary`: Net monthly salary (**number**, minimum 660) ⚠️ **NOT a string**
- `tipo`: Employee type (**string** - "PUBBLICO/STATALE", "PRIVATO", or "PARAPUBBLICO")
- `contratto`: Contract type (**string** - "INDETERMINATO", "DETERMINATO", or "ALTRO")
- `numDipendenti`: Number of employees in company (**string** or **null**, minimum 11, null for PUBBLICO/STATALE)
- `dataAssunzione`: Employment start date (**string** or **null**, ISO date format "YYYY-MM-DD")
- `tfr`: TFR (Trattamento di Fine Rapporto) (**string** or **null** - "SI" or "NO", null for PUBBLICO/STATALE or if hired less than 6 months ago)

### PENSIONATO Specific Fields
- `pension`: Net monthly pension (**number**, minimum 660) ⚠️ **NOT a string**
- `tipo`: Pension type (**string** - "PENSIONE DI VECCHIAIA", "PENSIONE DI ANZIANITA'", "PENSIONE DI REVERSIBILITA'", "PENSIONE DI INVALIDITA'", "INVALIDITA' CIVILE", "APE SOCIAL", "ASSEGNO SOCIAL", or "ALTRA TIPOLOGIA")
- `ente`: Pension entity (**string** - "INPS", "EX INPDAP", "ALTRO ENTE", or "PENSIONATO ITALIANO RESIDENTE ESTERO")

---

## Validation Notes

### DIPENDENTE
- `salary` must be >= 660
- `contratto` cannot be "DETERMINATO" (will be rejected)
- `numDipendenti` must be >= 11 (not required for PUBBLICO/STATALE)
- `tfr` must be "SI" if provided (NO is rejected)
- `tfr` is skipped for PUBBLICO/STATALE or if hired less than 6 months ago

### PENSIONATO
- `pension` must be >= 660
- Certain pension types cannot be financed: "INVALIDITA' CIVILE", "APE SOCIAL", "ASSEGNO SOCIAL"

---

## COMPREHENSIVE EXAMPLES - ALL POSSIBLE FIELDS

### Complete DIPENDENTE Example (All Fields - PRIVATO with all options)
```json
{
  "nome": "Mario",
  "cognome": "Rossi",
  "mail": "mario.rossi@email.it",
  "telefono": "+39 333 123 4567",
  "meseNascita": "05",
  "annoNascita": "1985",
  "amount": 30000,
  "salary": 1800,
  "tipo": "PRIVATO",
  "contratto": "INDETERMINATO",
  "numDipendenti": "150",
  "dataAssunzione": "2018-03-15",
  "tfr": "SI",
  "userPosition": "DIPENDENTE",
  "submittedAt": "2025-01-15T14:32:18.123Z"
}
```

### Complete DIPENDENTE Example (All Fields - PUBBLICO/STATALE)
```json
{
  "nome": "Giulia",
  "cognome": "Bianchi",
  "mail": "giulia.bianchi@email.it",
  "telefono": "+39 340 987 6543",
  "meseNascita": "09",
  "annoNascita": "1990",
  "amount": 25000,
  "salary": 2200,
  "tipo": "PUBBLICO/STATALE",
  "contratto": "INDETERMINATO",
  "numDipendenti": null,
  "dataAssunzione": "2020-06-01",
  "tfr": null,
  "userPosition": "DIPENDENTE",
  "submittedAt": "2025-01-15T16:45:22.456Z"
}
```

### Complete DIPENDENTE Example (All Fields - PARAPUBBLICO)
```json
{
  "nome": "Paolo",
  "cognome": "Ferrari",
  "mail": "paolo.ferrari@email.it",
  "telefono": "+39 345 111 2222",
  "meseNascita": "07",
  "annoNascita": "1988",
  "amount": 35000,
  "salary": 2000,
  "tipo": "PARAPUBBLICO",
  "contratto": "INDETERMINATO",
  "numDipendenti": "500",
  "dataAssunzione": "2019-11-20",
  "tfr": "SI",
  "userPosition": "DIPENDENTE",
  "submittedAt": "2025-01-15T18:30:10.789Z"
}
```

### Complete PENSIONATO Example (All Fields - All Pension Types)
```json
{
  "nome": "Luigi",
  "cognome": "Verdi",
  "mail": "luigi.verdi@email.it",
  "telefono": "+39 335 555 1234",
  "meseNascita": "12",
  "annoNascita": "1955",
  "amount": 25000,
  "pension": 1200,
  "tipo": "PENSIONE DI VECCHIAIA",
  "ente": "INPS",
  "userPosition": "PENSIONATO",
  "submittedAt": "2025-01-15T10:15:30.789Z"
}
```

### Complete PENSIONATO Example (All Fields - Alternative Pension Type)
```json
{
  "nome": "Anna",
  "cognome": "Neri",
  "mail": "anna.neri@email.it",
  "telefono": "+39 366 777 8888",
  "meseNascita": "03",
  "annoNascita": "1960",
  "amount": 20000,
  "pension": 1500,
  "tipo": "PENSIONE DI ANZIANITA'",
  "ente": "EX INPDAP",
  "userPosition": "PENSIONATO",
  "submittedAt": "2025-01-15T11:20:45.012Z"
}
```

### Complete PENSIONATO Example (All Fields - All Other Enti)
```json
{
  "nome": "Carlo",
  "cognome": "Esposito",
  "mail": "carlo.esposito@email.it",
  "telefono": "+39 388 999 0000",
  "meseNascita": "08",
  "annoNascita": "1958",
  "amount": 30000,
  "pension": 1800,
  "tipo": "PENSIONE DI REVERSIBILITA'",
  "ente": "ALTRO ENTE",
  "userPosition": "PENSIONATO",
  "submittedAt": "2025-01-15T12:00:00.000Z"
}
```

### Complete PENSIONATO Example (All Fields - Residente Estero)
```json
{
  "nome": "Sofia",
  "cognome": "Romano",
  "mail": "sofia.romano@email.it",
  "telefono": "+39 377 444 5555",
  "meseNascita": "02",
  "annoNascita": "1952",
  "amount": 28000,
  "pension": 1600,
  "tipo": "PENSIONE DI INVALIDITA'",
  "ente": "PENSIONATO ITALIANO RESIDENTE ESTERO",
  "userPosition": "PENSIONATO",
  "submittedAt": "2025-01-15T13:15:30.123Z"
}
```

---

## ALL POSSIBLE FIELD VALUES REFERENCE

### DIPENDENTE - `tipo` values:
- `"PUBBLICO/STATALE"`
- `"PRIVATO"`
- `"PARAPUBBLICO"`

### DIPENDENTE - `contratto` values:
- `"INDETERMINATO"` ✅ (accepted)
- `"DETERMINATO"` ❌ (rejected)
- `"ALTRO"`

### DIPENDENTE - `tfr` values:
- `"SI"` ✅ (accepted)
- `"NO"` ❌ (rejected)
- `null` (for PUBBLICO/STATALE or if hired < 6 months)

### PENSIONATO - `tipo` values:
- `"PENSIONE DI VECCHIAIA"`
- `"PENSIONE DI ANZIANITA'"`
- `"PENSIONE DI REVERSIBILITA'"`
- `"PENSIONE DI INVALIDITA'"`
- `"INVALIDITA' CIVILE"` ❌ (cannot be financed)
- `"APE SOCIAL"` ❌ (cannot be financed)
- `"ASSEGNO SOCIAL"` ❌ (cannot be financed)
- `"ALTRA TIPOLOGIA"`

### PENSIONATO - `ente` values:
- `"INPS"`
- `"EX INPDAP"`
- `"ALTRO ENTE"`
- `"PENSIONATO ITALIANO RESIDENTE ESTERO"`

### Common - `userPosition` values:
- `"DIPENDENTE"`
- `"PENSIONATO"`

