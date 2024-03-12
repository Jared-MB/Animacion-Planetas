# Guía Contribuir

¡Gracias por considerar contribuir a nuestro proyecto de código abierto! Apreciamos tu interés y apoyo. Al participar en este proyecto, aceptas cumplir con las siguientes pautas.

## Cómo Contribuir

1. **Hacer un Fork del Repositorio**: Comienza haciendo un fork de nuestro repositorio en tu cuenta de GitHub.

2. **Clonar el Repositorio**: Clona el repositorio forkeado a tu máquina local utilizando el siguiente comando:
   ```
   git clone https://github.com/tu-nombre-de-usuario/nombre-del-repositorio.git
   ```

3. **Crear una Rama**: Crea una nueva rama para tu contribución:
   ```
   git checkout -b feature/tu-característica
   ```

4. **Realizar Cambios**: Implementa tus cambios o agrega nuevas funcionalidades al código base.

    - Intenta mantener tus cambios enfocados, cambia solo los archivos necesarios. Si tienes múltiples cambios, considera crear solicitudes de extracción separadas para cada uno.

5. **Probar tus Cambios**: Asegúrate de que tus cambios estén correctamente probados y no introduzcan ninguna regresión.
    - Ejecuta las pruebas para asegurarte de que tus cambios no rompan ninguna funcionalidad existente. Puedes ejecutar las pruebas usando el comando `test`.
    - Si estás agregando una nueva funcionalidad, considera agregar nuevas pruebas para cubrirla. Para agregar nuevas pruebas, puedes crear un nuevo archivo en el directorio `__tests__` o agregar nuevos casos de prueba a un archivo existente.

6. **Confirmar Cambios**: Confirma tus cambios con un mensaje descriptivo:
   ```
   git commit -m 'Agregar una breve descripción de tus cambios'
   ```

7. **Enviar Cambios**: Envía tus cambios a tu repositorio forkeado:
   ```
   git push origin feature/tu-característica
   ```

8. **Enviar una Solicitud de Extracción (PR)**: Abre una solicitud de extracción desde tu repositorio forkeado a nuestro repositorio principal. Asegúrate de proporcionar una descripción clara de tus cambios en la PR.

## Guías de Estilo de Código

- Sigue el estilo de codificación y las convenciones utilizadas en el proyecto.
    - Utilizamos [Biome.js](https://biomejs.dev/) para lintear y formatear nuestro código. Puedes ejecutar el script `biome:lint` para buscar errores de linteo y `biome:format` para formatear (sobrescribir) tu código.
- Asegúrate de tener una documentación adecuada para las nuevas funcionalidades o cambios.
- Escribe un código claro y conciso que sea fácil de entender.

## Requisitos para fusionar tu PR

- Tu PR debe pasar todas las pruebas.
- Tu PR debe ser revisado y aprobado por al menos un mantenedor.
- Tu PR debe estar actualizado con los últimos cambios de la rama principal.
- Tu código debe seguir las guías del estilo de código.
- Tu PR debe pasar las comprobaciones de CI/CD.

## Licencia

Al contribuir a este proyecto, aceptas que tus contribuciones estarán bajo la licencia del proyecto [LICENSE](LICENSE).

¡Gracias por tu interés en contribuir a nuestro proyecto! Apreciamos tu apoyo y esperamos tus contribuciones. Si tienes alguna pregunta, no dudes en contactarnos.