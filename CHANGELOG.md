# CARELOGIX – CHANGELOG
### Autor: Master Sensei – CARELOGIX CRG SRL  
### Sistema DGII 606/607 Automatizado  
---

## 📌 Versión 5.0 — (2025-12-05)
### 🔥 Actualización mayor del sistema
**Cambios críticos:**
- Se libera el Worker v5.0 completamente rediseñado.
- El endpoint `/uploadFacturaImagen` ahora requiere obligatoriamente:
  - `fileName`
  - `fileBase64`
  - `fechaComprobante`
- Soporte oficial para carpetas mensuales automáticas (YYYYMM) en OneDrive.
- Sincronización completa con el GPT Module v1.1.5.
- Eliminación de inconsistencias anteriores sobre fechaComprobante.
- Validación estricta de Base64 y JSON entrada.
- Mejor manejo de errores en OneDrive y Excel.
- Documentación profesional agregada al README.

---

## 📌 Versión 4.2 — (2025-12-02)
### ✨ Revisión del Worker
- Primera versión con soporte a rutas:
  - `/uploadFacturaImagen`
  - `/insertFactura`
  - `/debug`
- Se agrega soporte para subida de imágenes vía Graph.
- Inserción directa en Excel Table1 mediante Microsoft Graph.
- Dependencia de fechaComprobante introducida pero no documentada.

---

## 📌 Versión 1.1.5 del GPT Module — (2025-12-05)
### 🧠 Mejoras en reglas DGII
- Actualización del módulo para alinear lógica con Worker v5.0.
- Nueva regla obligatoria:
  - `uploadFacturaImagen` debe incluir fechaComprobante.
- Mejor documentación del flujo 606/607.
- Formalización del menú CARELOGIX.
- Restricciones estrictas del JSON.
- Nueva estructura interna:
  - loteFacturas
  - facturaActual

---

## 📌 Versión 1.1.4 del GPT Module — (2025-12-03)
- Introducción de OCR automático.
- Validación completa de RNC, cédula, NCF.
- Generación exacta de 23 columnas para el 606.
- Menú interactivo CARELOGIX.
- Manejo de lotes de facturas.
- JSON para Worker en dos pasos.
- Primera versión del módulo FULL.

---

## 📌 Versión 1.0 — (2025-11-20)
### 🚀 Primer release del sistema CARELOGIX DGII
- Primera integración entre GPT y Worker.
- Generación de líneas contables 606/607.
- Uso de Microsoft Graph para almacenamiento.
- Procesamiento de facturas manual → GPT asistido.

---

# 🏁 Notas Finales

Este proyecto evoluciona bajo un único principio:
> **Automatizar la contabilidad dominicana sin errores ni fricción.**

Autor Oficial:  
**Master Sensei – CARELOGIX CRG SRL**

