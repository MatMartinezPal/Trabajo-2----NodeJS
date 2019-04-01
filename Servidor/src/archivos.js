const fs = require('fs');

var listaEstudiantes = [];
var listaCursos = [];
var listaRelacion = [];

const crearEstudiante = (estudiante) => {
    listarEstudiante();

    if (listaEstudiantes.length > 0){
        for (i=0; i<listaEstudiantes.length; i++){
            if (estudiante.cedula == listaEstudiantes[i].cedula){
                return false;
            }    
        }
    }
    let estudianteAgregar = {
        cedula: estudiante.cedula,
        nombre: estudiante.nombre,
        correo: estudiante.correo,
        telefono: estudiante.telefono,
        contrasenia: estudiante.contrasenia,
        rol: estudiante.rol
    };

    listaEstudiantes.push(estudianteAgregar);
    guardarEstudiante();
    return true;
}

const guardarEstudiante = () =>{

    let datos = JSON.stringify(listaEstudiantes);
    fs.writeFile('listaEstudiantes.json',datos,(err)=>{
        if (err) throw (err);
        console.log("Archivo guardado con exito");
    });
}

const guardarCurso = () =>{

    let datos = JSON.stringify(listaCursos);
    fs.writeFile('listaCursos.json',datos,(err)=>{
        if (err) throw (err);
        console.log("Archivo guardado con exito");
    });
}

const listarEstudiante = () => {
    try{
        listaEstudiantes = require("../listaEstudiantes.json");
    }
    catch(error){
        listaEstudiantes = [];
    }
}

const listarCursos = () => {
    try{
        listaCursos = require("../listaCursos.json");
    }
    catch(error){
        listaCursos = [];
    }
}

const listarRelacion= () => {
    try{
        listaRelacion = require("../listaRelacion.json");
    }
    catch(error){
        listaRelacion = [];
    }
}

const listaCursosDisponibles = () =>{
    listarCursos();
    listaCurDisponibles = [];
    for (i=0; i<listaCursos.length; i++){
        if(listaCursos[i].estado == "disponible"){
            listaCurDisponibles.push(listaCursos[i]);
        }
    }
    return listaCurDisponibles;  
}

const listaTodosCursos = () => {
    listarCursos();
    return listaCursos;
}

const guardarRelacion = (cedula_estudiante,id_curso) => {

    listarEstudiante();
    listarCursos();
    listarRelacion();

    var bandera = 0;

    for (i=0;i<listaRelacion.length;i++){
        if (listaRelacion[i].cedula_est === cedula_estudiante && listaRelacion[i].id_curso === id_curso){
            bandera = 1;
            break;
        }
    }

    if (bandera == 0)
    {

        let estudiante_encontrado = listaEstudiantes.find(function(estudiante_actual) {return estudiante_actual.cedula === cedula_estudiante});
        let curso_encontrado = listaCursos.find(function(curso_actual) {return curso_actual.id === id_curso});

        let relacion = {
            cedula_est : estudiante_encontrado.cedula,
            nombre_est : estudiante_encontrado.nombre,
            id_curso : curso_encontrado.id,
            nombre_curso : curso_encontrado.nombre,
            valor_curso : curso_encontrado.costo,
            descripcion_curso : curso_encontrado.descripcion
        };

        listaRelacion.push(relacion);
        
        crearRelacionJSON();

        return true;
    }

    else
    {

        return false;
    }

}

const crearRelacionJSON = () =>{
    let datos = JSON.stringify(listaRelacion);
    fs.writeFile('listaRelacion.json',datos,(err)=>{
        if (err) throw (err);
        console.log("Archivo guardado con exito");
    });

}

const login = (log)=>{
     
    listarEstudiante();

    let logfound = listaEstudiantes.find(function(logeo){return logeo.cedula === log.cedula});

    if (logfound != undefined){
        if (logfound.contrasenia === log.contrasenia){
            return logfound.rol;
        }else{
            return "indefinidido";
        }
    }       
    return "indefinidido";


}

const guardarlog = (cedula) =>{

    return listaEstudiantes.find(function(recordar){return recordar.cedula === cedula});

}

const misCursos = (cedula) =>{

    listarRelacion();

    let misCursosInscritos = [];
    for (i=0;i<listaRelacion.length;i++){
        if (listaRelacion[i].cedula_est === cedula){
            misCursosInscritos.push(listaRelacion[i]);
        }
    }
    return misCursosInscritos;
}

const eliminarCurso = (cedula,id_curso) => {

    listarRelacion();

    for (i=0;i<listaRelacion.length;i++){
        if (listaRelacion[i].cedula_est == cedula && listaRelacion[i].id_curso == id_curso){
            listaRelacion.splice(i,1);
        }
    }

    crearRelacionJSON();
}

const verMas = (id_curso) => {
    return listaCursos.find(function(curso_actual){return curso_actual.id === id_curso});
}

const crearCurso = (curso) => {
    listarCursos();

    let cursoEncontrado = listaCursos.find(function(curso_actual){return curso_actual.id === curso.id});

    if (cursoEncontrado != undefined){
        return false;
    }
    else{
        listaCursos.push(curso);
        guardarCurso();
        return true;
    }
}

const estudiantesEnElSistema = () =>{
    return listaEstudiantes;
}

const actualizarEstudiante = (datos) => {
    
    listarEstudiante();

    for (i=0;i<listaEstudiantes.length;i++){
        if(listaEstudiantes[i].cedula === datos.cedula){

            listaEstudiantes[i].nombre = datos.nombre;
            listaEstudiantes[i].correo = datos.correo;
            listaEstudiantes[i].contrasenia = datos.contrasenia;
            listaEstudiantes[i].rol = datos.rol;
            break;
        }
    }
    guardarEstudiante();
}

const estudiantesInscritos = (id_curso) => {

    listarRelacion();
    listarEstudiante();

    let lista_estudiantes_agregados = [];
    var id_estudiante_encontrado = 0;

    for (i=0;i<listaRelacion.length;i++){
        if (listaRelacion[i].id_curso === id_curso){
            id_estudiante_encontrado = listaRelacion[i].cedula_est;
            let estudianteEncontrado = listaEstudiantes.find(function(estudiante_actual){return estudiante_actual.cedula === id_estudiante_encontrado});
            lista_estudiantes_agregados.push(estudianteEncontrado);          
        }
    }
    return lista_estudiantes_agregados;
}

const cerrarCurso = (id_curso) =>{

    listarCursos();

    for (i=0;i<listaCursos.length;i++){
        if(listaCursos[i].id == id_curso){
            listaCursos[i].estado = "cerrado";
            break;
        }
    }

    guardarCurso();


} 


module.exports = {
    crearEstudiante,
    guardarEstudiante,
    listaCursosDisponibles, 
    guardarRelacion,
    login,
    guardarlog,
    misCursos,
    eliminarCurso,
    verMas,
    crearCurso,
    estudiantesEnElSistema,
    actualizarEstudiante,
    listaTodosCursos,
    estudiantesInscritos,
    cerrarCurso
}