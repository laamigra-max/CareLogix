# CARELOGIX – Sistema Automatizado DGII 606/607
### Procesamiento Inteligente de Facturas • OCR • Microsoft Graph • AI Automation  
**Autor:** Master Sensei – CARELOGIX CRG SRL  
**Versión del sistema:** 5.0  
**Última actualización:** 2025-12-05  

---

## 📌 Descripción General

CARELOGIX es una plataforma automática de procesamiento contable para la República Dominicana, diseñada para manejar **facturas de compras y ventas**, extraer datos vía **OCR**, validar reglas de la **DGII**, generar líneas **606/607**, y almacenarlas directamente en Microsoft Excel vía **Microsoft Graph**.

La automatización combina:

- Un **GPT personalizado** con reglas fiscales especializadas  
- Un **Worker Serverless** que sube imágenes a OneDrive  
- Un **Excel Online (Table1)** donde se escriben las líneas contables  
- Validaciones exactas para el cumplimiento tributario dominicano  

Todo el flujo está orquestado para eliminar errores humanos y acelerar la digitación fiscal.

---

## 🚀 Arquitectura del Sistema

```
Usuario → GPT Contable → OCR → Validaciones DGII  
       → Worker /uploadFacturaImagen → OneDrive  
       → Worker /insertFactura → Excel (Table1)
```

Componentes principales:

- `/docs/CARELOGIX_MODULE_v1.1.5_FULL.txt`   
  Reglas completas del GPT contable, incluyendo OCR, validación y menú.

- `/worker/worker-v5.0.js`  
  Worker serverless que maneja OneDrive y Excel.

- `/carelogix-actions.yaml`  
  Esquema OpenAPI usado por GPT Actions.

- `/gpt/GPT_INSTRUCTIONS_v1.1.5.txt`  
  Script que controla la conducta del GPT.

---

## 🧠 Flujo DGII (Paso por Paso)

### **1. Usuario sube factura**
El GPT realiza OCR automáticamente.

### **2. GPT extrae datos**
- RNC  
- Nombre proveedor  
- NCF  
- Fecha comprobante  
- Montos fiscales  
- ITBIS  
- Forma de pago  

### **3. GPT valida reglas DGII**
- Validación de NCF  
- Tipo de gasto  
- Clasificación 606/607  
- Determinación de ITBIS acreditable  

### **4. GPT genera estructuras JSON**
#### **uploadFacturaImagen**
```json
{
  "fileName": "FACTURA_202512_E310000000123456.png",
  "fileBase64": "data:image/png;base64,AAA...",
  "fechaComprobante": "20251205"
}
```

#### **insertFactura**
```json
{
  "values": [
    [
      "20251205",
      "202512",
      "606",
      "130853665",
      "1",
      "E31000000123456",
      "31",
      "20251205",
      "20251205",
      "1500.00",
      "270.00",
      "1",
      "https://onedrive/.../FACTURA.png"
    ]
  ]
}
```

### **5. GPT muestra menú CARELOGIX**
```
1. Subir más facturas  
2. Enviar a la nube todas las fotos capturadas  
3. Cancelar y borrar datos temporales  
```

---

## 🗂 Estructura del Repositorio

```
/
│ README.md
│ CHANGELOG.md
│ carelogix-actions.yaml
│ privacy-policy.md
│
├── docs/
│   └── CARELOGIX_MODULE_v1.1.5_FULL.txt
│
├── worker/
│   ├── worker-v5.0.js
│   └── worker-example.env
│
└── gpt/
    └── GPT_INSTRUCTIONS_v1.1.5.txt
```

---

## 🔧 Tecnologías Utilizadas

- **Cloudflare Workers**
- **Microsoft Graph API**
  - OneDrive Upload
  - Excel Table Row Insert
- **Custom GPT (OpenAI)**
- **OCR integrado**
- **JavaScript ES Modules**

---

## 🛠 Variables de Entorno Requeridas

El Worker requiere:

```
CLIENT_ID
CLIENT_SECRET
TENANT_ID
DRIVE_ID
EXCEL_ITEM_ID
```

Estas deben configurarse en:

```
Cloudflare Dashboard → Worker → Settings → Variables
```

---

## 🔐 Seguridad

- Ningún dato fiscal se guarda fuera del entorno autorizado.
- Todas las comunicaciones usan HTTPS.
- El token OAuth2 de Microsoft Graph se maneja a nivel serverless.

---

## 🧾 Licencia

Propiedad privada de **Master Sensei – CARELOGIX CRG SRL**.  
Reservados todos los derechos.

---

## 🤝 Contacto

**Master Sensei – CARELOGIX CRG SRL**  
📧 soporte@carelogix.pro  
🌐 https://carelogix.pro
