const client = {
  documento: parseInt(document.getElementById('documento').value) || null,
  nombre:    document.getElementById('nombre').value.trim(),
  apellido:  document.getElementById('apellido').value.trim(),
  celular:   document.getElementById('celular').value.trim(),
  correo:    document.getElementById('correo').value.trim(),
  direccion: document.getElementById('direccion').value.trim(),
  ciudad:    document.getElementById('ciudad').value.trim()   // ← este campo sí existe
  // NO incluyas 'password' ni 'contraseña' por ahora
};