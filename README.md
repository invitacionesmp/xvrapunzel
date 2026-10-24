# Invitación XV Años · estilo cuento (Rapunzel)

Abre `index.html` en el navegador (o súbela a cualquier hosting estático).
Todo lo editable está en `js/config.js` (nombre, fecha, mapa, WhatsApp, música).
Los textos del pergamino, itinerario y tarjetas se editan directo en `index.html`.

## Estructura
```
invitacion-rapunzel/
├─ index.html
├─ css/style.css
├─ js/config.js      ← datos de la invitación
├─ js/main.js        ← animaciones, cuenta regresiva, carrusel, música
├─ audio/musica.mp3  ← REEMPLAZA con tu canción (mismo nombre)
└─ img/
   ├─ fondo.jpg            1080 × 1920 px  (fondo estático, 9:16)
   ├─ portada.jpg           900 × 1100 px  (foto dentro del arco)
   ├─ pergamino.png        1224 × 1536 px  (pergamino retocado, ya incluido)
   ├─ flores-izq-sup.png    520 × 420 px   (PNG transparente, esquina del pergamino)
   ├─ flores-der-inf.png    520 × 420 px   (PNG transparente, esquina del pergamino)
   ├─ foto-parallax.jpg    1080 × 1600 px
   ├─ foto-itinerario.jpg  1080 × 1350 px  (reservada)
   ├─ foto-final.jpg       1080 × 1800 px
   └─ galeria/foto1.jpg … foto4.jpg   1000 × 1250 px (4:5)
```
Para agregar más fotos a la galería: duplica un `<figure>` en `index.html`.

## Fondo estático (img/fondo.jpg)
- Medida: **1080 × 1920 px** (proporción 9:16, vertical). Si quieres máxima nitidez: 1440 × 2560.
- Formato JPG o WebP, idealmente **menos de 500 KB**.
- Se ajusta con `cover` y se recorta según la pantalla: deja lo importante en el centro y deja ~10 % libre arriba y abajo.
- Las imágenes actuales son marcadores de posición: solo reemplázalas con el mismo nombre.
