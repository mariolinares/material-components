import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

/**
 * @title Chips Autocomplete with Reactive Form
 */
@Component({
  selector: 'chips-reactive-form-example',
  templateUrl: 'chips-reactive-form-example.html',
  styleUrl: 'chips-reactive-form-example.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatFormFieldModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
  ],
})
export class ChipsReactiveFormExample {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  readonly fruitCtrl = new FormControl('');
  readonly fruits = signal(['Lemon']);
  readonly allFruits: string[] = [
    'Apple',
    'Lemon',
    'Lime',
    'Orange',
    'Strawberry',
  ];

  readonly filteredFruits = computed(() => {
    const currentFruit = this.fruitCtrl.value?.toLowerCase() ?? '';
    return currentFruit
      ? this.allFruits.filter((fruit) =>
          fruit.toLowerCase().includes(currentFruit)
        )
      : this.allFruits.slice();
  });

  readonly announcer = inject(LiveAnnouncer);

  constructor() {
    this.fruitCtrl.valueChanges.subscribe(console.log);
  }

  submit() {
    console.log(this);
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.fruits.update((fruits) => [...fruits, value]);
      this.announcer.announce(`added ${value}`);
    }

    this.fruitCtrl.setValue('');
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

    this.fruitCtrl.setValue('');
    event.option.deselect();
  }
}
