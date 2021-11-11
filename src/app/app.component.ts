import { Component } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Angular-Drag-Drop';

  state;
  currentFile = {
    index: 0
  };
  files = [];
  index = 0;

  movies = [
    {
      name: 'Episode I - The Phantom Menace',
      order: 3
    },
    {
      name: 'Episode II - Attack of the Clones',
      order: 2
    },
    {
      name: 'Episode III - Revenge of the Sith',
      order: 4
    },
    {
      name: 'Episode IV - A New Hope',
      order: 1
    },
    {
      name: 'Episode V - The Empire Strikes Back',
      order: 5
    },
    {
      name: 'Episode VI - Return of the Jedi',
      order: 6
    },
    {
      name: 'Episode VII - The Force Awakens',
      order: 7
    },
    {
      name: 'Episode VIII - The Last Jedi',
      order: 9
    },
    {
      name: 'Episode IX – The Rise of Skywalker',
      order: 8
    }
  ];

  todo = [
    {
      name: 'Get to work',
      order: 1
    },
    {
      name: 'Pick up groceries',
      order: 4
    },
    {
      name: 'Go home',
      order: 2
    },
    {
      name: 'Fall asleep',
      order: 3
    }
  ];

  done = [
    {
      name: 'Get up',
      order: 2
    },
    {
      name: 'Brush teeth',
      order: 1
    },
    {
      name: 'Take a shower',
      order: 3
    },
    {
      name: 'Check e-mail',
      order: 4
    },
    {
      name: 'Walk dog',
      order: 5
    }
  ];

  constructor() {
    this.movies = this.sortData(this.movies);
    this.todo = this.sortData(this.todo);
    this.done = this.sortData(this.done);
  }

  ngOnInit() {
  }

  sortData(data) {
    data.sort((a, b) => {
      return a.order - b.order;
    });
    return data;
  }

  drop(event: CdkDragDrop<string[]>) {
    console.log(event);
    console.log(event.previousIndex, event.currentIndex);
    moveItemInArray(this.movies, event.previousIndex, event.currentIndex)
    this.updateDataForMoveItem(this.movies);
  }

  dropTransfer(event: CdkDragDrop<string[]>) {
    console.log(event);
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.updateDataForMoveItem(event.container.data);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      this.updateDataForTransferItem(event.previousContainer.data, event.container.data);
    }
  }

  updateDataForMoveItem(data) {
    data.forEach((elem: any, index: number) => {
      elem.order = index + 1;
    });
    console.log('Updated data array => ', data);
  }

  updateDataForTransferItem(prevData, currData) {
    prevData.forEach((elem: any, index: number) => {
      elem.order = index + 1;
    });
    currData.forEach((elem: any, index: number) => {
      elem.order = index + 1;
    });
    console.log('Updated previous data => ', prevData);
    console.log('Updated current data => ', currData);
  }

}
