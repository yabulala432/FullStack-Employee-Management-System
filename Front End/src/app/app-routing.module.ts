import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FromServerComponent } from './components/from-server/from-server.component';

const routes: Routes = [
  { path: '', redirectTo: 'from-server', pathMatch: 'full' },
  { path: 'from-server', component: FromServerComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes), CommonModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
