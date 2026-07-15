import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ProcessingDialogComponent } from '../processing-dialog/processing-dialog.component';

@Component({
  selector: 'app-premium-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './premium-dialog.component.html',
  styleUrls: ['./premium-dialog.component.css']
})
export class PremiumDialogComponent {
  private dialogRef = inject(MatDialogRef<PremiumDialogComponent>);
  private dialog = inject(MatDialog);

  selectedPlan = signal<number>(3); // Default a ENTERPRISE MAX++

  selectPlan(planId: number) {
    this.selectedPlan.set(planId);
  }

  onUpdateNow() {
    this.dialogRef.close();
    this.dialog.open(ProcessingDialogComponent, {
      width: '450px',
      disableClose: true
    });
  }

  onMaybeLater() {
    this.dialogRef.close('cancel');
  }

  onLogout() {
    this.dialogRef.close('logout');
  }
}
