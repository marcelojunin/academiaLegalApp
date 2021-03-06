import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExercicioService } from '../../services/domain/exercicio.service';
import { GrupoService } from '../../services/domain/grupo.service';
import { GrupoDTO } from '../../models/grupo.dto';
import { forkJoin } from 'rxjs/observable/forkJoin';

@IonicPage()
@Component({
  selector: 'page-admin-exercicio-save',
  templateUrl: 'admin-exercicio-save.html',
})
export class AdminExercicioSavePage {

  formGroup: FormGroup;
  grupos: GrupoDTO[];
  grupo_id: any;
  codigo = this.navParams.get('id');

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public exercicioService: ExercicioService,
    public grupoService: GrupoService,
    public loadingCtrl: LoadingController) {
      
      this.formGroup = this.formBuilder.group({
        nome:['', [Validators.required, Validators.minLength(5), Validators.maxLength(80)]],
        grupo_id:['', [Validators.required]],
      });
  
    };
      
  ionViewDidLoad() 
  {
    this.listGrupo();

    if(this.codigo)
    {
      this.edit(this.codigo);
    }

  };

  edit(id: string)
  {
    let loader = this.presentLoading();
    let getExercicio = this.exercicioService.findOne(id);
    let getGrupo = this.exercicioService.findOneGrupoByExercicio(id);
    
    forkJoin([getExercicio, getGrupo])
        .subscribe(results => {
          loader.dismiss();
          let nome = results[0].nome;
          let grupo_id = results[1].id;
          this.fillForm(nome, grupo_id);

        }, error => {
          loader.dismiss();
        });
  };

  fillForm(nome: string, grupo_id: any)
  {
    this.formGroup = this.formBuilder.group({
      nome:[nome , [Validators.required, Validators.minLength(5), Validators.maxLength(80)]],
      grupo_id:[grupo_id, [Validators.required]],
    });
  };

  listGrupo()
  {
    this.grupoService.findAll()
      .subscribe(response => {
        this.grupos = response;
      }, error => {});
  };

  findOneGrupoByExercicio(id: string)
  {
    this.exercicioService.findOneGrupoByExercicio(id)
      .subscribe(response => {
        response;
        console.log(response);
                
      }, error => {});
  };

  save()
  {
    if(this.codigo != null)
    {
      this.update(this.codigo, this.formGroup.value);
      
      return;
    };

    this.create(this.formGroup.value);
  };

  update(id: string, exercicio: any)
  {
    let loader = this.presentLoading();
    this.exercicioService.update(id, exercicio)
      .subscribe(response => {
        loader.dismiss();
        let operacao = 'atualizado';
        this.success(exercicio.nome, operacao);
      }, error => {
        loader.dismiss();
      });
  };

  create(exercicio: any)
  {
    let loader = this.presentLoading();
    this.exercicioService.create(exercicio)
      .subscribe(response => {
        let operacao = 'criado';
        this.success(exercicio.nome, operacao);
        loader.dismiss();
      }, error => {
        loader.dismiss();
      });
  }

  success(nome: string, operacao:string)
  {
    let alert = this.alertCtrl.create({
      title: 'Sucesso!',
      message: 'O exercício ' + nome +' foi ' + operacao + ' com sucesso!',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.navCtrl.pop();
          }
        }
      ]
    });
    alert.present();
  };

  presentLoading()
  {
    let loader = this.loadingCtrl.create({
      content: "Carregando..."
    });

    loader.present();
    return loader;
  }
};
