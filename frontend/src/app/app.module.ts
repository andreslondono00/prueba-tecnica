import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Importar HeaderComponent
import { HeaderComponent } from './components/layout/header/header.component';

// Importar otros componentes que ya tengas
import { LoadingSpinnerComponent } from './components/shared/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from './components/shared/error-message/error-message.component';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';

// Importar componentes de páginas
import { TicketListComponent } from './pages/tickets/ticket-list/ticket-list.component';
import { TicketDetailComponent } from './pages/tickets/ticket-detail/ticket-detail.component';
import { TicketFormComponent } from './pages/tickets/ticket-form/ticket-form.component';
import { ClientListComponent } from './pages/clients/client-list/client-list.component';
import { ClientDetailComponent } from './pages/clients/client-detail/client-detail.component';
import { ClientFormComponent } from './pages/clients/client-form/client-form.component';
import { AgentListComponent } from './pages/agents/agent-list/agent-list.component';
import { AgentDetailComponent } from './pages/agents/agent-detail/agent-detail.component';

// Toastr (si lo estás usando)
import { ToastrModule } from 'ngx-toastr';

@NgModule({
    declarations: [
        // Componente principal
        AppComponent,

        // Layout Components
        HeaderComponent,  // ← ¡IMPORTANTE! Añadir HeaderComponent aquí

        // Shared Components
        LoadingSpinnerComponent,
        ErrorMessageComponent,

        // Ticket Components
        TicketListComponent,
        TicketDetailComponent,
        TicketFormComponent,

        // Client Components
        ClientListComponent,
        ClientDetailComponent,
        ClientFormComponent,

        // Agent Components
        AgentListComponent,
        AgentDetailComponent
    ],
    imports: [
        // Angular Core Modules
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,  // ← Importar RouterModule

        // App Routing
        AppRoutingModule,

        // Third Party Modules
        ToastrModule.forRoot({
            timeOut: 5000,
            positionClass: 'toast-top-right',
            preventDuplicates: true,
            closeButton: true
        })
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }