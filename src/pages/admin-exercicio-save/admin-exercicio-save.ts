import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
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

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public exercicioService: ExercicioService,
    public grupoService: GrupoService) {
      
      this.formGroup = this.formBuilder.group({
        nome:['', [Validators.required, Validators.minLength(5), Validators.maxLength(80)]],
        grupo_id:['', [Validators.required]],
      });
  
    };
      
  ionViewDidLoad() 
  {

    let codigo = this.navParams.get('id');

    this.listGrupo();

    if(codigo)
    {
      this.edit(codigo);
    }

  };

  edit(id: string)
  {
    let getExercicio = this.exercicioService.findOne(id);
    let getGrupo = this.exercicioService.findOneGrupoByExercicio(id);

    forkJoin([getExercicio, getGrupo])
        .subscribe(results => {

          let nome = results[0].nome;
          let grupo_id = results[1].id;
          this.fillForm(nome, grupo_id);

        }, error => {});
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
   console.log(this.formGroup.value);
  }

}
