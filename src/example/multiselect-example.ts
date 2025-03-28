import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from "@angular/material/autocomplete";
import { MatChipInputEvent, MatChipsModule } from "@angular/material/chips";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import {
  CdkDrag,
  CdkDropList,
  CdkDragDrop,
  moveItemInArray,
  DragDropModule,
} from "@angular/cdk/drag-drop";
import {MatButtonModule} from '@angular/material/button';

/**
 * @title Chips Autocomplete with Reactive Form
 */
@Component({
  selector: "multiselect-example",
  templateUrl: "multiselect-example.html",
  styleUrl: "multiselect-example.css",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatFormFieldModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    CdkDropList,
    CdkDrag,
    DragDropModule,
  ],
})
export class MultiselectExample {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  readonly fc = new FormControl("");
  readonly fruits = signal<string[]>([]);

  readonly allFruits: string[] = [
    "Av. Marcial, 38",
    "Estación de Atocha",
    "Estación de Chamartín",
  ];

  readonly filteredFruits = computed(() => {
    const currentFruit = this.fc.value?.toLowerCase() ?? "";
    return currentFruit
      ? this.allFruits.filter((fruit) =>
          fruit.toLowerCase().includes(currentFruit)
        )
      : this.allFruits.slice();
  });

  readonly announcer = inject(LiveAnnouncer);

  submit() {
    console.log("Selected fruits (ordered):", this.fruits());
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || "").trim();

    if (value && !this.fruits().includes(value)) {
      this.fruits.update((fruits) => [...fruits, value]);
      this.announcer.announce(`added ${value}`);
    }

    this.fc.setValue("");
    event.chipInput?.clear();
  }

  remove(fruit: string): void {
    this.fruits.update((fruits) => {
      const index = fruits.indexOf(fruit);
      if (index < 0) return fruits;

      fruits.splice(index, 1);
      this.announcer.announce(`removed ${fruit}`);
      return [...fruits];
    });
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const selectedFruit = event.option.viewValue;

    if (!this.fruits().includes(selectedFruit)) {
      this.fruits.update((fruits) => [...fruits, selectedFruit]);
    }

    this.fc.setValue("");
    event.option.deselect();
  }

  drop(event: CdkDragDrop<string[]>) {
    this.fruits.update((fruits) => {
      const updated = [...fruits];
      moveItemInArray(updated, event.previousIndex, event.currentIndex);
      return updated;
    });
  }
}
