import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { uk_UA } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import uk from '@angular/common/locales/uk';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { IconsProviderModule } from './icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzGraphModule } from 'ng-zorro-antd/graph';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { AddEmployeeComponent } from './components/add-employee/add-employee.component';
import { InfoEmployeeComponent } from './components/info-employee/info-employee.component';
import { MainScreenComponent } from './components/main-screen/main-screen.component';
import { UpdateEmployeeComponent } from './components/update-employee/update-employee.component';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { GraphComponent } from './components/graph/graph.component';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NgxEchartsModule } from 'ngx-echarts';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { BalkanGraphComponent } from './components/graph/balkan-graph/balkan-graph.component';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
registerLocaleData(uk);

// @ts-ignore
@NgModule({
  schemas: [NO_ERRORS_SCHEMA],
  declarations: [
    AppComponent,
    AddEmployeeComponent,
    InfoEmployeeComponent,
    MainScreenComponent,
    UpdateEmployeeComponent,
    GraphComponent,
    BalkanGraphComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    AppRoutingModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    NzGraphModule,
    NzRadioModule,
    NzButtonModule,
    NzTreeModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    NzFormModule,
    ReactiveFormsModule,
    NzSelectModule,
    NzInputModule,
    NzTableModule,
    NzModalModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [{ provide: NZ_I18N, useValue: uk_UA }, NzModalService],
  bootstrap: [AppComponent],
})
export class AppModule {}
