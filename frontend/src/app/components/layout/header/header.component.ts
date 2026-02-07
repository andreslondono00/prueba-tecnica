import { Component } from '@angular/core';

@Component({
    selector: 'app-header',
    template: `
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div class="container">
        <a class="navbar-brand" routerLink="/">
          <i class="bi bi-ticket-detailed me-2"></i>
          Support Tickets
        </a>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" 
                data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/tickets" routerLinkActive="active">
                <i class="bi bi-ticket me-1"></i>
                Tickets
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/clients" routerLinkActive="active">
                <i class="bi bi-people me-1"></i>
                Clients
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/agents" routerLinkActive="active">
                <i class="bi bi-person-badge me-1"></i>
                Agents
              </a>
            </li>
          </ul>
          
          <div class="d-flex">
            <a routerLink="/tickets/new" class="btn btn-primary">
              <i class="bi bi-plus-circle me-1"></i>
              New Ticket
            </a>
          </div>
        </div>
      </div>
    </nav>
  `,
    styles: [`
    .navbar {
      padding: 0.75rem 0;
      box-shadow: 0 2px 4px rgba(0,0,0,.1);
    }
    
    .navbar-brand {
      font-weight: 700;
      font-size: 1.5rem;
      color: #0d6efd;
    }
    
    .nav-link {
      font-weight: 500;
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
    }
    
    .nav-link:hover, .nav-link.active {
      background-color: rgba(13, 110, 253, 0.1);
      color: #0d6efd;
    }
  `]
})
export class HeaderComponent { }