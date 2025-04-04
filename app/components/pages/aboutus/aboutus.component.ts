import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.scss'],
  standalone: true,  // Mark the component as standalone
  imports: [CommonModule] 
})
export class AboutusComponent implements OnInit{

  ourValues:any[]=[
    {
      img:'../../../../assets/about/container5/img1.png',
      title:'Integridade',
      subtitle:' "Operamos com transparência e honestidade em todas as nossas negociações."'
    },
    {
      img:'../../../../assets/about/container5/img2.png',
      title:'Inovação',
      subtitle:'“Nós abraçamos a criatividade e nos esforçamos para ultrapassar os limites do que é possível."'
    },
    {
      img:'../../../../assets/about/container5/img3.png',
      title:'Foco no cliente',
      subtitle:'“Nossos clientes estão no centro de tudo o que fazemos."'
    },
    {
      img:'../../../../assets/about/container5/img4.png',
      title:'Excelência',
      subtitle:'“Estamos comprometidos com os mais altos padrões de qualidade em cada projeto."'
    },
  ];
  ngOnInit(): void {
      
  }
}
