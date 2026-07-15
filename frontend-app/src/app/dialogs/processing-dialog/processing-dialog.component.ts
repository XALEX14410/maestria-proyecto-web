import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-processing-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatProgressSpinnerModule, MatIconModule],
  templateUrl: './processing-dialog.component.html',
  styleUrls: ['./processing-dialog.component.css']
})
export class ProcessingDialogComponent implements OnInit {
  isJokeRevealed = signal(false);
  loadingText = signal('Procesando...');

  constructor(private dialogRef: MatDialogRef<ProcessingDialogComponent>) {}

  ngOnInit() {
    const messages = [
      'Conectando con Angular Cloud...',
      'Descargando felicidad...'
    ];

    let step = 0;
    const interval = setInterval(() => {
      if (step < messages.length) {
        this.loadingText.set(messages[step]);
        step++;
      } else {
        clearInterval(interval);
        this.isJokeRevealed.set(true);
      }
    }, 1200); // Wait longer so they can read it
  }

  onAccept() {
    this.dialogRef.close();
  }
}
