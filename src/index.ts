console.log('FUNCIONA !!');
import express, {Application} from 'express';


// morgan
import morgan from 'morgan';
import cors from 'cors';
import indexRoutes from './routes/indexRoutes';


class Server {
    // servidor basico montado.
    public app: Application;
    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }
    // encargado configurar la propiedad app
    config(): void {
        // puerto
        // process.env.PORT || --> si existe puerto, usarlo.
        // de lo contrario, 3000
        this.app.set('port', 3000);
        console.log('lacccc')
        this.app.use(morgan('devt'));
        this.app.use(cors({credentials: true, origin: 'http://localhost:4200'}));

        // this.app.use(function(req, res, next) {
        //     res.setHeader('Access-Control-Allow-Origin', '*');
        //     res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        //     res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
        //     next();
        //   });
        // this.app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
        // habilitar la opcion de entender formatos JSON
        // y guardarlo
        this.app.use(express.json());
        // poder enviar en  formularios  html
        this.app.use(express.urlencoded({extended: false}));
    }
    // definir las rutas de mi servidor
    routes(): void {
        this.app.use('/', indexRoutes);
        // // antes de acceder a estas rutas, tiene que pasar por indexRoutes
        // this.app.use('/api/authUser', authClientRoutes);
        // this.app.use('/api/users', usersRoutes);

        // this.app.use('/api/authAdmin', authAdminRoutes);
        // this.app.use('/api/admins', adminsRoutes);

        // this.app.use('/api/vehicles', vehiclesRoutes);

        // this.app.use('/api/expedientes', expedientesRoutes);
       
        // this.app.use('/api/file',fileRoutes);
        
    }
    // inicializar el servidor app.listen
    start(): void {
        this.app.listen(this.app.get('port'), () => {
            console.log('server on port ', this.app.get('port'));
        });
    }
}


const server = new Server();
server.start();