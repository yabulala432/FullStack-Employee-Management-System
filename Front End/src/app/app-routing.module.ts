import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UpdateEmployeeComponent } from './components/update-employee/update-employee.component';
import { InfoEmployeeComponent } from './components/info-employee/info-employee.component';
import { AddEmployeeComponent } from './components/add-employee/add-employee.component';
import { GraphComponent } from './components/graph/graph.component';
import { TreeViewComponent } from './components/tree-view/tree-view.component';

const routes: Routes = [
  { path: 'view-employee', component: GraphComponent },
  { path: 'update-employee', component: TreeViewComponent },
  { path: 'info-employee', component: InfoEmployeeComponent },
  { path: 'add-employee', component: AddEmployeeComponent },
  { path: '**', redirectTo: 'view-employee' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
