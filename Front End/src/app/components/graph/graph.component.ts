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

  // options: any = {
  //   tooltip: {
  //     trigger: 'item',
  //     triggerOn: 'mousemove',
  //   },
  //   series: [
  //     {
  //       type: 'tree',
  //       data: [],
  //       top: '10%',
  //       left: '7%',
  //       bottom: '1%',
  //       right: '7%',
  //       symbol: 'emptyCircle',
  //       symbolSize: 40,
  //       label: {
  //         formatter: function (params: any) {
  //           return `${params.name}`;
  //         },
  //         rich: {
  //           image: {
  //             name: 'imageUrl',
  //             height: 50,
  //             align: 'center',
  //             backgroundColor: 'red',
  //           },
  //         },
  //         position: 'left',
  //         verticalAlign: 'middle',
  //         align: 'right',
  //         fontSize: 12,
  //       },
  //       leaves: {
  //         label: {
  //           position: 'right',
  //           verticalAlign: 'middle',
  //           align: 'left',
  //         },
  //       },
  //       expandAndCollapse: true,
  //       animationDuration: 550,
  //       animationDurationUpdate: 750,
  //     },
  //   ],
  // };

  defaultOrientation: 'TB' | 'LR' | 'BT' | 'RL' = 'BT';

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
          this.transformData(response as Array<Employee>)
        );
      },
      error: () => {},
    });
  }

  transformData(data: Employee[]): Employee {
    const transformedData: Record<string, Employee> = {};

    for (const item of data) {
      const itemId = item._id;
      const itemPid = item.pid;
      const itemName = item.name;
      const itemRole = item.role;
      const itemEmail = item.email;
      const itemTel = item.tel;
      const itemImageUrl = item.imageUrl;

      const itemObject: Employee = {
        _id: itemId,
        name: itemName,
        role: itemRole,
        email: itemEmail,
        tel: itemTel,
        imageUrl: itemImageUrl,
        symbol: itemImageUrl,
        children: [],
      };

      if (itemPid) {
        const parentItem = transformedData[itemPid];
        if (parentItem) {
          parentItem.children!.push(itemObject);
        }
      }

      transformedData[itemId] = itemObject;
    }

    let rootItem: Employee | undefined;
    for (const item of Object.values(transformedData)) {
      if (!item.pid) {
        rootItem = item;
        break;
      }
    }

    return rootItem!;
  }

  currentPage: 'page1' | 'page2' = 'page1';
  previousPage: string = '';

  togglePage() {
    this.previousPage = this.currentPage;
    this.currentPage = this.currentPage === 'page2' ? 'page1' : 'page2';
  }

  onRadioChange(): void {
    this.options.series[0].orient = this.defaultOrientation;
    // console.log(this.options.series[0].orient);
    this.currentPage = 'page2';
    setTimeout(() => {
      this.currentPage = 'page1';
    }, 10);
  }
}
