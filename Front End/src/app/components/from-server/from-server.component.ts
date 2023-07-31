import { Component, OnInit } from '@angular/core';
import { FetchService } from '../../services/fetchEmployee.service';
import OrgChart from '@balkangraph/orgchart.js';

export interface MainApi {
  role: string;
  name: string;
  imageUrl: string;
  tel: string;
  email: string;
}

interface Role {
  role: string;
  worksUnder: string;
}

@Component({
  selector: 'app-from-server',
  templateUrl: './from-server.component.html',
})
export class FromServerComponent implements OnInit {
  onAddFormSubmitted($event: Event) {
    console.log($event);
  }
  constructor(private fetchEmployeeService: FetchService) {}

  allDataOfEmployee: any;
  // array of employee to add
  // two way binding
  parentName: string = '';
  imageUrl: string = '';
  tel: string = '';
  role: string = '';
  email: string = '';
  name: string = '';

  // delete data booleans
  showDeleteDialog: boolean = false;
  showAddDialog: boolean = false;
  deleteApproved: boolean = false;

  approveDelete() {
    this.deleteApproved = true;
    this.showDeleteDialog = false;
  }

  onCancelClick() {
    this.showDeleteDialog = false;
  }

  closeModal = () => {
    let modal: HTMLElement | null = document.getElementById('editModal');
    if (modal) modal.classList.add('hidden');
    this.showAddDialog = false;
  };

  addToDataBase() {
    // console.log(
    //   this.parentName,
    //   this.imageUrl,
    //   this.tel,
    //   this.role,
    //   this.email,
    //   this.name
    // );

    // const parentId = this._apiService.getIdFromName(this.parentName);
    const body: MainApi = {
      role: this.role,
      name: this.name,
      imageUrl: this.imageUrl,
      tel: this.tel,
      email: this.email,
    };

    this.fetchEmployeeService.addChild(this.parentName, body).subscribe({
      next: (response) => {
        console.log(response);
        this.fetchFromDatabase().subscribe({
          next: (response) => {
            this.loadDataForChart(response);
            this.showAddDialog = false;
          },
          error: (err) => {
            console.error(err);
          },
        });
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  deleteEmployee(id: string) {
    this.fetchEmployeeService.deleteData(id);
  }

  roles: string[] = [];
  private _employeeNames: string[] = [];

  public get employeeNames(): string[] {
    return this._employeeNames;
  }

  pushToNamesArray(value: string) {
    this._employeeNames.push(value);
  }

  fetchFromDatabase() {
    return this.fetchEmployeeService.getData();
  }

  custom() {
    OrgChart.templates['yabTemplate'] = Object.assign(
      {},
      OrgChart.templates['ana']
    );
    // OrgChart.templates['yabTemplate'].size = [100, 100];
    OrgChart.templates['yabTemplate'].node =
      '<rect x="0" y="0" height="{h}" width="{w}" fill="#ffffff" stroke-width="1" stroke="#aeaeae" rx="5" ry="5"></rect>';
    OrgChart.templates['yabTemplate'].defs = '';
    OrgChart.templates['yabTemplate'].ripple = {
      radius: 100,
      color: '#e6e6e6',
      rect: [0],
    };
    OrgChart.templates['yabTemplate']['field_0'] =
      '<text data-width="220" style="font-size: 18px;" fill="#039BE5" x="125" y="20" text-anchor="middle">{val}</text>';

    OrgChart.templates['yabTemplate']['field_1'] =
      '<text data-width="220" style="font-size: 14px;" fill="#039BE5" x="125" y="110" text-anchor="middle">{val}</text>';
    OrgChart.templates['yabTemplate']['img_0'] =
      '<clipPath id="{randId}"><circle cx="135" cy="80" r="60"></circle></clipPath>' +
      '<image preserveAspectRatio="xMidYMid slice" clip-path="url(#{randId})" xlink:href="{val}" x="95" y="33" width="60" height="60"></image>';
    OrgChart.templates['yabTemplate'].link =
      '<path stroke="#aeaeae" stroke-width="1px" fill="none" d="M{xa},{ya} C{xb},{yb} {xc},{yc} {xd},{yd}" />';


    OrgChart.templates['yabTemplate'].nodeMenuButton =
      '<g style="cursor:pointer;" transform="matrix(1,0,0,1,225,60)" data-ctrl-n-menu-id="{id}">' +
      '<rect x="-4" y="-10" fill="#3e97f0" fill-opacity="0" width="22" height="22"></rect>' +
      '<circle cx="0" cy="0" r="2" fill="#3e97f0"></circle><circle cx="0" cy="0" r="2" fill="#3e97f0"></circle>< circle cx = "7" cy = "0" r = "2" fill = "#3e97f0" > </circle>' +
      '<circle cx="14" cy="0" r="2" fill="#3e97f0"></circle>' +
      '</g>';

   
    OrgChart.templates['yabTemplate'].pointer =
      '<g data-pointer="pointer" transform="matrix(0,0,0,0,100,100)">><g transform="matrix(0.3,0,0,0.3,-17,-17)">' +
      '<polygon fill="rgb(255, 202, 40)" points="53.004,173.004 53.004,66.996 0,120" />' +
      '<polygon fill="rgb(255, 202, 40)" points="186.996,66.996 186.996,173.004 240,120" />' +
      '<polygon fill="rgb(255, 202, 40)" points="66.996,53.004 173.004,53.004 120,0" />' +
      '<polygon fill="rgb(255, 202, 40)" points="120,240 173.004,186.996 66.996,186.996" />' +
      '<circle fill="rgb(255, 202, 40)" cx="120" cy="120" r="30" />' +
      '</g></g>';
    OrgChart.templates['yabTemplate'].menuButton =
      '<div style="position:absolute;right:{p}px;top:{p}px; width:40px;height:50px;cursor:pointer;" data-ctrl-menu="">' +
      '<hr style="background-color: rgb(62, 151, 240); height: 3px; border: none;">' +
      '<hr style="background-color: rgb(62, 151, 240); height: 3px; border: none;">' +
      '<hr style="background-color: rgb(62, 151, 240); height: 3px; border: none;">' +
      '</div>';
  }
  ngOnInit() {
    this.fetchFromDatabase().subscribe({
      next: (response) => {
        // console.log(response);
        const tree = document.getElementById('tree');
        if (tree) {
          console.log('yes');

          this.custom();
          let chart = new OrgChart(tree, {
            template: 'yabTemplate',
            nodeBinding: {
              field_0: 'name',
              img_0: 'img',
              field_1: 'role',
            },
            nodeMenu: {
              details: { text: 'Details' },
              edit: { text: 'Edit' },
              remove: { text: 'Remove' },
            },
          });
          this.loadDataForChart(response);
          chart.load(this.allDataOfEmployee);
          chart.on('click', function (sender, args) {
            console.log('Node clicked:', args.node);
            // Add your code to trigger here
          });
          chart.onAddNode(() => {
            this.showAddDialog = true;
            // console.log('add');
            let modal: HTMLElement | null =
              document.getElementById('editModal');
            if (modal) modal.classList.remove('hidden');
          });

          chart.onRemoveNode((node) => {
            console.log({ id: node.id });
            if (window.confirm('sure you wanna delete this???')) {
              this.deleteEmployee(node.id as string);
            } else {
              console.log(node);
            }
          });

          chart.onNodeClick(() => {
            console.log('clicked');
          });
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  loadDataForChart(response: any) {
    this.allDataOfEmployee = [];
    // const mainData = [];
    for (let value of response) {
      // console.log({value});

      const result = {
        id: value._id,
        name: value.name,
        role: value.role,
        img: value.imageUrl,
        tel: value.tel,
        email: value.email,
        pid: value?.pid,
      };
      this.pushToNamesArray(result.name);
      this.allDataOfEmployee.push(result);
    }
    // console.log({mainData});

    // return mainData;
  }
}
