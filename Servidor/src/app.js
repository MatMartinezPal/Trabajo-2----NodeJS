const funciones_estudiantes = require("./archivos");

// Las paginas dinamicas van a estar en views, las estaticas en public.

const express = require("express");
const app = express();
const path = require("path");

const bodyParser = require("body-parser");

 // Require para el HBS, esto sirve para nuestras paginas dinamicas,
const hbs = require("hbs");

// Require para los helpers.
require("./helpers.js");

const directorioPublico = path.join(__dirname,"../public"); // Para indicarle donde esta el directorio publico

const directorioPartials = path.join(__dirname,"../partials"); // Para indicarle donde estan los partials
// Los partials son partes de codigo que voy a repetir en varios archivos html. Si dentro de los partials tengo
// {{estudiante}}, estudiante debe ser enviado o de lo contrario tendremos un error.



// Le indico a express que usare el body parser.
app.use(bodyParser.urlencoded({extended : false}));

app.use(express.static(directorioPublico));

// Registro los partials y asi el sabe en donde los va a poder ubicar mediante el directorioPartials.
hbs.registerPartials(directorioPartials); 

app.set("view engine","hbs");

// Usuario Logeado

var auxlog = undefined;

// Archivos creados

var listasCreadas = 0;


// METODOS GET:

// Cuando ingrese a la pagina de error.
app.get("/error",(req,res) =>{
    res.render("error");
});

// Cuando ingrese a la pagina de registro.
app.get("/registro",(req,res) => {
    res.render("registro");
});


app.get("/cursos",(req,res) =>{
    if (auxlog != undefined){
        res.render("cursos",{
            est: auxlog,
            cursos_disponibles : funciones_estudiantes.listaCursosDisponibles()
        });
    }
    else{
        res.redirect("error");
    }

});

app.get("/verCursosInter",(req,res)=> {
    res.render("verCursosInter",{
        cursos_disponibles : funciones_estudiantes.listaCursosDisponibles()
    });
});

app.get("/misCursos",(req,res) => {
    if (auxlog != undefined){
        res.render("misCursos", {
            est : auxlog,
            misCursos : funciones_estudiantes.misCursos(auxlog.cedula)
        });
    }
    else{
        res.redirect("error");
    }
});

app.get("/eliminarRelacion",(req,res) => {
    if (auxlog != undefined){
        let cedula = req.query.estudiante_id;
        let curso_id = req.query.id;

        funciones_estudiantes.eliminarCurso(cedula,curso_id);
        res.render("misCursos", {
            est : auxlog,
            misCursos : funciones_estudiantes.misCursos(auxlog.cedula)
        });
    }
    else{
        res.redirect("error");
    }

});


app.get("/inscripcion",(req,res) =>{

    let cedula = req.query.estudiante_id;
    let curso_id = req.query.id;

    if (funciones_estudiantes.guardarRelacion(cedula,curso_id) == true){
        res.render("inscripcion");
    }
    else{
        res.redirect("error");
    }
    
});


app.get("/verMas",(req,res) =>{

    let curso_id = req.query.id;

    if (auxlog != undefined){
        res.render("verMas" , {
            curso : funciones_estudiantes.verMas(curso_id)
        });
    }
    else{
        res.redirect("error");
    }
    
});

app.get("/verMasInter",(req,res) =>{

    let curso_id = req.query.id;

    res.render("verMasInter" , {
        curso : funciones_estudiantes.verMas(curso_id)
    });
    
});

app.get("/salir", (req,res) =>{
    auxlog = undefined;
    res.render("index");
})


app.get("/index", (req,res) =>{
    if (listasCreadas == 0){
        funciones_estudiantes.crearListasJSON();
        listasCreadas = 1;
    }
    res.render("index");
});

app.get("/crearCursos", (req,res) => {
    if (auxlog != undefined){
        res.render("crearCursosCoord");
    }
    else{
        res.redirect("error");
    }

})

app.get("/estudiantesSistema", (req,res) => {
    if (auxlog != undefined){
        res.render("actualizarDatosCoord" ,{
            estudiantes: funciones_estudiantes.estudiantesEnElSistema()
        });
    }
    else{
        res.redirect("error");
    }

});

app.get("/administrarCursos", (req,res) =>{
    if (auxlog != undefined){
        res.render("verCursosCoord",{
            cursos: funciones_estudiantes.listaTodosCursos()
        });
    }
    else{
        res.redirect("error");
    }
});

app.get("/eliminarInscripcion" ,(req,res) => {

    let cedula = req.query.id;
    let id_curso = req.query.id_curso;
    let nombre_curso = req.query.nombre_curso;

    funciones_estudiantes.eliminarCurso(cedula,id_curso);

    res.render("verInscritosCoord", {
        inscritos : funciones_estudiantes.estudiantesInscritos(id_curso),
        curso: nombre_curso,
        id_cur : id_curso
    });

});

app.get("/cerrarCurso", (req,res) => {

    let id_curso = req.query.id;

    funciones_estudiantes.cerrarCurso(id_curso);

    res.render("verCursosCoord", {
        cursos: funciones_estudiantes.listaTodosCursos()
    });

})

// METODOS POST:

// Cuando ingrese llene el formulario de registro va a acceder aqui.
app.post("/cursos",(req,res) =>{
    auxlog = {
        cedula: req.body.id,
        nombre: req.body.nombre,
        correo: req.body.correo,
        telefono: req.body.telefono,
        contrasenia: req.body.password,
        rol: "aspirante"
    };

    if (funciones_estudiantes.crearEstudiante(auxlog) == true){
        res.render("cursos",{
            est: auxlog,
            cursos_disponibles : funciones_estudiantes.listaCursosDisponibles()
        });
    }
    else{
        res.redirect("error");
    }
});

app.post("/login",(req,res)=>{

        let login = {
            cedula: req.body.cedula_log,
            contrasenia: req.body.pass_log,          
        };

        let rolLogeado = funciones_estudiantes.login(login);

        if (rolLogeado != "indefinido"){
            auxlog = funciones_estudiantes.guardarlog(login.cedula);
            if (rolLogeado === "aspirante"){
                res.render("cursos",{
                est : auxlog,
                cursos_disponibles : funciones_estudiantes.listaCursosDisponibles()           
                });
            }
            else if (rolLogeado === "coordinador"){
                res.render("crearCursosCoord");                  
            }
            else{
                res.redirect("error");
            }
        }else{
            res.redirect("error");
        }


});

app.post("/crearCursos", (req,res) => {

    let cursoNuevo = {
        id: req.body.id,
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        costo: req.body.costo,
        modalidad: req.body.modalidad,
        intensidad: req.body.duracion,
        estado: "disponible"
    };

    if (funciones_estudiantes.crearCurso(cursoNuevo) == true){
        res.render("cursosExito");
    }
    else{
        res.redirect("error");
    }

});

app.post("/modificarDatos" , (req,res) =>{

    let cedula = req.body.cedula;
    let nombre = req.body.nombre;

    res.render("formActuaCoord", {
        cedula : cedula,
        nombre : nombre
    });
});


app.post("/actualizarAlumno" , (req,res) =>{

    let datos = {
        cedula : req.body.cedula,
        nombre : req.body.nombre,
        correo : req.body.correo,
        contrasenia : req.body.contrasenia,
        rol : req.body.rol
    };

    funciones_estudiantes.actualizarEstudiante(datos);

    res.render("actualizarDatosCoord" ,{
        estudiantes: funciones_estudiantes.estudiantesEnElSistema()
    });
});


app.post("/verInscritos", (req,res) => {

    let id_curso = req.body.id;
    let nombre_curso = req.body.nombre_curso;
    let estudiantes_inscritos = funciones_estudiantes.estudiantesInscritos(id_curso);

    res.render("verInscritosCoord", {
        inscritos : estudiantes_inscritos,
        curso : nombre_curso,
        id_cur: id_curso
    });
})


// Para escuchar el puerto 3000 y que nuestro aplicativo se ejecute en la web.
app.listen(3000);