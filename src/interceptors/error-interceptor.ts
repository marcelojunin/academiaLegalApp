import { StorageService } from './../services/storage.service';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AlertController } from 'ionic-angular';
import { FieldMessage } from '../models/fieldmessage';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor{

    constructor(
        public storage: StorageService,
        public alertCtrl: AlertController){

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
        return next.handle(req)
            .catch((error, caught) => {
                
                let errorObj = error;

                if(errorObj.error)
                {
                    errorObj = errorObj.error;
                }

                if(!errorObj.status)
                {
                    errorObj = JSON.parse(errorObj);
                }

                console.log('Erro detectado pelo interceptor: ');
                console.log(errorObj);

                switch(errorObj.status)
                {
                    case 400:
                    this.handler400(errorObj)
                    break; 

                    case 401:
                    this.handler401();
                    break;

                    case 403:
                    this.handler403();
                    break;

                    case 404:
                    this.handler404(errorObj);
                    break

                    case 422:
                    this.handler422(errorObj);
                    break;

                    default:
                    this.handlerDefaultError(errorObj);
                }

                return Observable.throw(errorObj);
            }) as any;
    };

    handler400(errorObj)
    {
        let alert = this.alertCtrl.create({
            title: errorObj.message,
            message: errorObj.error,
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: 'Ok'
                }
            ]
        });
        alert.present();
    }

    handler401()
    {
        let alert = this.alertCtrl.create({
            title: 'Falha de autenticação',
            message: 'E-mail ou senha incorreto.',
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: 'Ok'
                }
            ]
        });
        alert.present();
    };

    handler403()
    {
        this.storage.setLocalUser(null);
    };

    handler404(errorObj)
    {
        let alert = this.alertCtrl.create({
            title: errorObj.message,
            message: errorObj.error,
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: 'Ok'
                }
            ]
        });
        alert.present();
    };

    handler422(errorObj)
    {
        let alert = this.alertCtrl.create({
            title: 'Error de validação',
            message: this.listErrors(errorObj.errors),
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: 'Ok'
                }
            ]
        });
        alert.present();
    };

    private listErrors(messages: FieldMessage[]) : string {
        let s: string = '';
        for(var i = 0; i < messages.length; i++)
        {
            s = s + '<p><strong>' + messages[i].fieldName + '</strong>: ' + messages[i].message + '</p>'
        }

        return s;
    }

    handlerDefaultError(errorObj)
    {
        let alert = this.alertCtrl.create({
            title: 'Erro ' + errorObj.status + ': ' + errorObj.error,
            message: errorObj.message,
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: 'Ok'
                }
            ]
        });
        alert.present();
    }
};

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true,
}
