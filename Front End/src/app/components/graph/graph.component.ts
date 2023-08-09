import { Component, OnInit, ViewChild } from '@angular/core';
import { FetchEmployeeService } from '../../services/fetch-employee.service';

interface Employee {
  _id: string;
  pid?: string;
  name: string;
  role: string;
  email: string;
  tel: string;
  imageUrl: string;
  symbol?: string;
  children?: Employee[];
}

@Component({
  selector: 'app-tree-graph',
  templateUrl: `./graph.component.html`,
  styleUrls: ['./graph.component.css'],
})
export class GraphComponent implements OnInit {
  radioOptions: any[] = [
    { label: 'BT', value: 'BT' },
    { label: 'RL', value: 'RL' },
    { label: 'LR', value: 'LR' },
    { label: 'TB', value: 'TB' },
  ];

  initOpts: any = {
    renderer: 'canvas',
  };

  defaultOrientation: 'TB' | 'LR' | 'BT' | 'RL' = 'TB';

  options: any = {
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove',
    },
    series: [
      {
        type: 'tree',
        data: [],
        top: '10%',
        left: '7%',
        bottom: '1%',
        right: '7%',
        symbol: 'emptyCircle',
        symbolSize: 40,
        label: {
          formatter: function (params: any) {
            return `${params.name}`;
          },
          rich: {
            imageUrl: {
              height: 50,
              align: 'center',
              backgroundColor: 'red',
            },
          },
          position: 'left',
          verticalAlign: 'middle',
          align: 'right',
          fontSize: 16,
          fontWeight: 'bold',
          color: 'white',
        },
        leaves: {
          label: {
            position: 'right',
            verticalAlign: 'middle',
            align: 'left',
          },
        },
        expandAndCollapse: true,
        animationDuration: 550,
        animationDurationUpdate: 750,
        orient: this.defaultOrientation,
      },
    ],
  };

  constructor(private fetchService: FetchEmployeeService) {}

  ngOnInit() {
    this.fetchService.getData().subscribe({
      next: (response) => {
        this.options.series[0].data.push(
          this.fetchService.transformData(response as Array<Employee>)
        );
      },
      error: () => {},
    });
  }

  currentPage: 'page1' | 'page2' | undefined = 'page2';
  previousPage: string = '';

  togglePage() {
    if (this.currentPage) {
      this.previousPage = this.currentPage;
      this.currentPage = this.currentPage === 'page2' ? 'page1' : 'page2';
    }
  }

  onRadioChange(): void {
    this.options.series[0].orient = this.defaultOrientation;
    // console.log(this.options.series[0].orient);
    this.currentPage = undefined;
    setTimeout(() => {
      this.currentPage = 'page1';
    }, 10);
  }
}
