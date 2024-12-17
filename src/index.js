const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

// Habilitar CORS para todas las rutas
app.use(cors());

// Middleware para manejar datos JSON en el cuerpo de la solicitud
app.use(express.json());

// Ruta para obtener los datos del archivo JSON
app.get('/api/data', (req, res) => {
  const filePath = path.join(__dirname, 'data.json');
  
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error al leer el archivo' });
    }
    
    res.json(JSON.parse(data));
  });
});


app.get('/api/data/:name', (req, res) => {
  const filePath = path.join(__dirname, 'data.json');

  const nombreBuscado = req.params.name;  // Obtener el parámetro 'nombre' de la URL
  
  // Leer el archivo JSON de manera asíncrona
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error al leer el archivo' });
    }

    const jsonData = JSON.parse(data);
   
    if(jsonData.data.length === 0){
      // return res.status(404).json({ error: 'Nombre no encontrado' });
      return res.status(200).json(null);
    }
    // Buscar el objeto con el nombre especificado
    const resultado = jsonData.data?.find(item => item.name.toLowerCase() === nombreBuscado.toLowerCase());
    
    // Si no se encuentra el nombre, devolver vacío
    if (!resultado) {
      return  res.json(null);
    }
    // Si se encuentra el nombre, devolver el objeto
    res.json(resultado);
  });
});


app.post('/api/data', (req, res) => {
  const filePath = path.join(__dirname, 'data.json');
  const newData = req.body; 
   // Validar que los datos sean válidos
  if (!newData || !newData.name) {
    return res.status(400).json({ error: 'Datos incompletos. Se requieren nombre.' });
  }
  // // Leer el archivo JSON y agregar el nuevo dato
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error al leer el archivo' });
    }
    
    const jsonData = JSON.parse(data);
   
    jsonData.data.push({
      name: newData.name,
      points: 0,
      autoClickerBaseCost: 50,
      numAutoClickers: 0
    });

    // Escribir los datos actualizados en el archivo JSON
    fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error al guardar los datos' });
      }
      // Confirmar que los datos fueron agregados
      res.json({ message: 'Nuevo dato agregado correctamente', data: newData });
    });
  });
});


app.put('/api/data', (req, res) => {
  const filePath = path.join(__dirname, 'data.json');
  const newData = req.body;  
  // Validar que los datos sean válidos
  if (!newData.user || !newData.user.name) {
    return res.status(400).json({ error: 'No se enviaron datos válidos' });
  } 

  fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Error al leer el archivo' });
      }
      
      const jsonData = JSON.parse(data);
      const foundIndex = jsonData.data.findIndex((m) => m.name === newData?.user.name);

      if(foundIndex === -1){
        return res.status(500).json({ error: 'User not found' });
      }     
     
      jsonData.data[foundIndex]=newData.user;

      fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
        if (err) {
          return res.status(500).json({ error: 'Error al guardar los datos' });
        }
  
        // Confirmar que los datos fueron agregados
        res.json({ message: 'Usuario actualizado correctamente', data: newData });
      });
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
