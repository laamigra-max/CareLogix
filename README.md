# CARELOGIX – Sistema Automatizado DGII 606/607
### Procesamiento Inteligente de Facturas • OCR • Microsoft Graph • AI Automation  
**Autor:** Master Sensei – CARELOGIX CRG SRL  
**Versión del sistema:** 5.0  
**Última actualización:** 2025-12-05  

---

## 📌 Descripción General

CARELOGIX es una plataforma automática para procesar facturas dominicanas, extraer información vía **OCR**, validar reglas de la **DGII**, generar líneas **606/607**, y almacenarlas directamente en Microsoft Excel a través de **Microsoft Graph**.

El sistema está compuesto por tres pilares:

- **GPT Contable** (interpretación, OCR, validación fiscal)
- **Worker Serverless (Cloudflare)** (almacenamiento + escritura en Excel)
- **Excel Online (Table1)** como base contable central

---

## 🚀 Arquitectura del Sistema

```
Usuario → GPT Contador → OCR → Validaciones DGII
       → Worker /uploadFacturaImagen → OneDrive (imagen)
       → Worker /insertFactura → Excel Online (fila 606/607)
```

---

## 🧠 Flujo Completo DGII

### 1. El usuario sube una factura  
El GPT hace OCR automático.

### 2. El GPT extrae & valida:  
- RNC o Cédula  
- Nombre proveedor  
- Tipo NCF & número  
- Fecha comprobante  
- Fecha pago  
- Monto facturado  
- ITBIS  
- Exento / gravado  
- Propina  
- Forma de pago  
- Reglas fiscales DGII  

### 3. El GPT genera JSON → Worker  
Ejemplo `uploadFacturaImagen`:

```json
{
  "fileName": "FACTURA_202512_E310000004899.png",
  "fileBase64": "data:image/png;base64,AAA...",
  "fechaComprobante": "20251205"
}
```

Ejemplo `insertFactura`:

```json
{
  "values": [
    [
      "20251205",
      "202512",
      "606",
      "130853665",
      "1",
      "E310000004899",
      "31",
      "20251205",
      "20251205",
      "2000.00",
      "360.00",
      "1",
      "https://onedrive/.../FACTURA.png"
    ]
  ]
}
```

### 4. El GPT muestra menú CARELOGIX  
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

- Cloudflare Workers  
- Microsoft Graph API (OneDrive + Excel)  
- OCR integrado  
- GPT personalizado DGII  
- JavaScript ES Modules

---

## 🛠 Variables de Entorno Requeridas

```
CLIENT_ID       → Azure App Registration
CLIENT_SECRET   → Client Secret
TENANT_ID       → Directory ID
DRIVE_ID        → Drive destino en OneDrive/SharePoint
EXCEL_ITEM_ID   → ID del archivo Excel contable
```

Se configuran en:

```
Cloudflare Dashboard → Worker → Settings → Variables
```

---

## 🔐 Seguridad

- Tokens de Microsoft Graph nunca se exponen al usuario.  
- El GPT no tiene acceso a secretos.  
- Todo viaja por HTTPS.  

---

## 🧾 Licencia

Propiedad privada de **Master Sensei – CARELOGIX CRG SRL**  
Reservados todos los derechos.

---

## 🤝 Contacto

📧 soporte@carelogix.pro  
🌐 https://carelogix.pro  
📌 GitHub: https://github.com/laamigra-max/CareLogix
