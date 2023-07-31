import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogConfig, MatDialogModule } from '@angular/material/dialog';

import { FromServerComponent } from './components/from-server/from-server.component';
import { HttpClientModule } from '@angular/common/http';
import { AddFormComponent } from './components/from-server/add-form/add-form.component';

@NgModule({
  declarations: [
    AppComponent,
    FromServerComponent,
    AddFormComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    MatDialogConfig,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
