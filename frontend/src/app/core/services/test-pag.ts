// @if(totalPages() > 1) {
//   <nav class="pagination" aria-label="Pagination">
//     <!-- Previous Button -->
//     <app-mini-fab-btn
//       iconName="chevron_left"
//       [disabled]="!hasPrevious()"
//       (click)="prev()"
//       [attr.aria-label]="'Previous page'"
//     />
    
//     <!-- Page Numbers -->
//     @for(page of visiblePages(); track $index) {
//       @if(page === '...') {
//         <span class="pagination__ellipsis" aria-hidden="true">...</span>
//       } @else {
//         <app-mini-fab-btn
//           [class.active]="isActive(page)"
//           [btnText]="page"
//           (click)="goTo(page)"
//           [bgColor]="isActive(page) ? 'var(--mat-sys-primary)' : 'transparent'"
//           btnBorder="2px solid var(--mat-sys-primary-container)"
//           [attr.aria-label]="'Go to page ' + page"
//           [attr.aria-current]="isActive(page) ? 'page' : null"
//         />
//       }
//     }
    
//     <!-- Next Button -->
//     <app-mini-fab-btn
//       iconName="chevron_right"
//       [disabled]="!hasNext()"
//       (click)="next()"
//       [attr.aria-label]="'Next page'"
//     />
//   </nav>
// }