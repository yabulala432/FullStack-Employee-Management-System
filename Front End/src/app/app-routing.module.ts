import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainScreenComponent } from './components/main-screen/main-screen.component';
import { UpdateEmployeeComponent } from './components/update-employee/update-employee.component';
import { InfoEmployeeComponent } from './components/info-employee/info-employee.component';
import { AddEmployeeComponent } from './components/add-employee/add-employee.component';
import { GraphComponent } from './components/graph/graph.component';

const routes: Routes = [
  { path: '', component: MainScreenComponent },
  // {path: 'view-employee', component: ViewComponent},
  { path: 'view-employee', component: GraphComponent },
  { path: 'update-employee', component: UpdateEmployeeComponent },
  { path: 'info-employee', component: InfoEmployeeComponent },
  { path: 'add-employee', component: AddEmployeeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
