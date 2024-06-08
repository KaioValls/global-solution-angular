import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild, type OnInit } from '@angular/core';
import {
  PoButtonModule,
  PoFieldModule,
  PoInfoModule,
  PoModalAction,
  PoModalComponent,
  PoModalModule,
  PoPageModule,
  PoTableModule,
  PoTagModule,
} from '@po-ui/ng-components';
import { Especies, Ocean, ProjetosConservacao } from '../../../interface/ocean';
import { OceanService } from '../../../services/ocean.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-table-oceans',
  standalone: true,
  imports: [
    CommonModule,
    PoTableModule,
    PoButtonModule,
    PoTagModule,
    PoInfoModule,
    PoPageModule,
    PoModalModule,
    PoFieldModule,
    ReactiveFormsModule
  ],
  templateUrl: './table-oceans.component.html',
  styleUrls: ['./table-oceans.component.css'],
})
export class TableOceansComponent implements OnInit {

  constructor(private oceanService: OceanService, private formBuilder:FormBuilder) {}
  @ViewChild('modalEspecies') modalEspecies!: PoModalComponent;
  @ViewChild('modalProjetos') modalProjetos!: PoModalComponent;

  pagina = 1;
  qtde = 20;

  oceans: Ocean[] = [];
  especies:Especies[]=[];
  projetos:ProjetosConservacao[]=[];

  conservationStatus = [];
  regioes:any[] = [];
  niveis:any[] = []
  species:{label:string, value:string}[] = []
  statusConservacao:any[] = []

  searchForm! : FormGroup;
  isLoading = false;
  hasNext = true;

  ngOnInit(): void {
    this.getOceans();
    this.getAtributesForList()
    this.createFormSearch()
  }

  search(){
    const search = this.searchForm.getRawValue();

    this.verificaVazio(search);

    this.oceanService.getOceansSearch(search).subscribe((res) => {
      this.oceans = res
    });
    this.hasNext=false;
  }

  private verificaVazio(search: any) {
    if (search.temperaturaAgua != null) {
      search.temperaturaMin = search.temperaturaAgua;
      search.temperaturaMax = search.temperaturaAgua <= 97 ? parseInt(search.temperaturaAgua)+3 : search.temperaturaAgua;
    } else {
      search.temperaturaMin = 0;
      search.temperaturaMax = 100;
    }
    if (search.ph != null) {
      search.phMin = search.ph;
      search.phMax = search.ph <= 9 ? parseInt(search.ph)+1 : search.ph;
    } else {
      search.phMin = 0;
      search.phMax = 10;
    }
  }

  getAtributesForList() {
    this.isLoading=true;
    let regioes:string[] = []
    let niveis:string[] = []
    let species:string[] = []
    let statusConservacao:string[] = []

    this.oceanService.getOceans(this.pagina, 100).subscribe((ocean) => {
      ocean.forEach((o)=>{
        o.especies.forEach((s)=>{
          if(!species.includes(s.nome)){
            species.push(s.nome)
          }
          if(!statusConservacao.includes(s.status)){
            statusConservacao.push(s.status)
          }
        })



        if(!regioes.includes(o.regiao)){
          regioes.push(o.regiao)
          }

        if(!niveis.includes(o.nivelPoluicao)){
          niveis.push(o.nivelPoluicao)
        }
      })

    regioes.forEach((regiao) => {
      this.regioes =  [...this.regioes, { value: regiao, label: regiao}]

    });
    niveis.forEach((nv) => {
      this.niveis = [...this.niveis, { value: nv, label: nv}]
    });
    species.forEach((sp) => {
      this.species = [...this.species, { value: sp, label: sp}]
    });
    statusConservacao.forEach((sc) => {
      this.statusConservacao =  [...this.statusConservacao, { value: sc, label: sc}]
    });

    });

  }

  createFormSearch() {
    this.searchForm = this.formBuilder.group({
      regiao : null,
      especies : null,
      temperaturaAgua: null,
      ph : null,
      statusConservacao: null,
      niveis:null
    })
  }

  clear(){
    this.searchForm.reset();
  }

  getOceans() {
    this.isLoading=true;
    this.oceanService.getOceans(this.pagina).subscribe((ocean) => {
      if(this.pagina==1){this.oceans=[]}
      this.oceans = this.oceans.concat(ocean)
      this.isLoading=false
      this.hasNext=true
    });
  }

  columns = [
    { property: 'regiao', label: 'Região' },
    { property: 'temperaturaAgua', label: 'C°' },
    { property: 'pH', label: 'PH' },
    { property: 'nivelPoluicao', label: 'Nv Poluição' },
    { property: 'actions', label: 'Especies', type: 'cellTemplate' },
    { property: 'projetos', label: 'Projetos', type: 'cellTemplate' },
  ];

  getEspecie() {}

  onClick() {}

  loadMore() {
    this.pagina++;
    this.getOceans()
  }

  openModalEspecies(especies: Especies[]){
    this.especies = especies
    this.modalEspecies.open();
  }

  openProjetosModal(projetos: ProjetosConservacao[]){
    this.projetos = projetos
    this.modalProjetos.open();
  }

}
