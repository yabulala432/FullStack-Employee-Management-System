import { Component, OnInit } from '@angular/core';
import { FetchEmployeeService } from 'src/app/services/fetch-employee.service';
import OrgChart from 'src/assets/balkanapp/orgchart';

interface EmployeeData {
  name: string;
  role: string;
  imageUrl: string;
  _id: string;
  pid?: string;
  email: string;
  tel: string;
}

interface EmployeeDataForChart {
  name: string;
  role: string;
  img: string;
  id: string;
  pid?: string;
  email: string;
  tel: string;
}

@Component({
  selector: 'app-balkan-graph',
  templateUrl: './balkan-graph.component.html',
})
export class BalkanGraphComponent implements OnInit {
  constructor(private fetchService: FetchEmployeeService) {}

  ngOnInit() {
    this.fetchService.getData().subscribe({
      next: (data) => {
        const tree = document.getElementById('tree');
        if (tree) {
          var chart = new OrgChart(tree, {
            nodeBinding: {
              field_0: 'name',
              img_0: 'img',
              field_1: 'role',
            },
          });
          let dataForChart: EmployeeDataForChart[] = [];
          (data as EmployeeData[]).map((item) => {
            dataForChart.push({
              name: item.name,
              role: item.role,
              img: item.imageUrl,
              id: item._id,
              pid: item.pid,
              email: item.email,
              tel: item.tel,
            });
          });
          chart.load(dataForChart);
        }
      },
    });
  }
}
