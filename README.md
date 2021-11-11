# Exploring Drag and Drop with the new Angular Material CDK
https://material.angular.io/cdk/drag-drop/overview

The @angular/cdk/drag-drop module provides you with a way to easily and declaratively create drag-and-drop interfaces, with support for free dragging, sorting within a list, transferring items between lists, animations, touch devices, custom drag handles, previews, and placeholders, in addition to horizontal lists and locking along an axis.

### Installation

Include the following in app.component.ts
```
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
```

Add style in app.component.scss
```
.example-list {
    width: 500px;
    max-width: 100%;
    border: solid 1px #ccc;
    min-height: 60px;
    display: block;
    background: white;
    border-radius: 4px;
    overflow: hidden;
  }
  
  .example-box {
    padding: 20px 10px;
    border-bottom: solid 1px #ccc;
    color: rgba(0, 0, 0, 0.87);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    cursor: move;
    background: white;
    font-size: 14px;
    span{
        background-color: #CC0000;
        color: #ffffff;
        width: 24px;
        height: 24px;
        text-align: center;
        font-size: 15px;
        line-height: 24px;
    }
  }
  
  .cdk-drag-preview {
    box-sizing: border-box;
    border-radius: 4px;
    box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
                0 8px 10px 1px rgba(0, 0, 0, 0.14),
                0 3px 14px 2px rgba(0, 0, 0, 0.12);
  }
  
  .cdk-drag-placeholder {
    opacity: 0;
  }
  
  .cdk-drag-animating {
    transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
  }
  
  .example-box:last-child {
    border: none;
  }
  
  .example-list.cdk-drop-list-dragging .example-box:not(.cdk-drag-placeholder) {
    transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
  }
```

Need to add "DragDropModule" in "app.module.ts" so it is available for use in the Angular Application like so:
```
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {CommonModule} from '@angular/common';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    NoopAnimationsModule,
    DragDropModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```


### Normal Drag and Drop

The MoveItemsInArray method takes three parameters:

The list array where it would do the sort work
1. "event.previousIndex" which is the previous index of the dragged item to drop.
2. "event.currentIndex" which is the current index where the dragged item is being dropped so it can do the swap.

app.component.html
```
<div cdkDropList class="example-list" (cdkDropListDropped)="drop($event)">  
          <div class="example-box" *ngFor="let movie of movies" cdkDrag>
            <span>{{movie.order}}</span> {{movie.name}}</div>
        </div>
```
app.component.ts
```
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

drop(event: CdkDragDrop<string[]>) {
    console.log(event);
    console.log(event.previousIndex, event.currentIndex);
    moveItemInArray(this.movies, event.previousIndex, event.currentIndex)
    this.updateDataForMoveItem(this.movies);
  }

  updateDataForMoveItem(data) {
    data.forEach((elem: any, index: number) => {
      elem.order = index + 1;
    });
    console.log('Updated data array => ', data);
  }
```

1. cdkDropList directive for making draggable content
2. cdkDropListDropped event for moving list items up and down a list
3. moveItemsInArray method to re-order the list
4. updateDataForMoveItem method to update the list with order no, so if required you can send the data to database for saving

### Transferring Items between lists
The cdkDropList directive supports transferring dragged items between two or more lists.
You can connect one or more cdkDropList instances together by setting the cdkDropListConnectedTo property or by wrapping the elements in an element with the cdkDropListGroup attribute.

app.component.html
```
<div class="col-sm-6">
            <div
              cdkDropList
              #todoList="cdkDropList"
              [cdkDropListData]="todo"
              [cdkDropListConnectedTo]="[doneList]"
              class="example-list"
              (cdkDropListDropped)="dropTransfer($event)">
              <div class="example-box" *ngFor="let item of todo" cdkDrag><span>{{item.order}}</span> {{item.name}}</div>
            </div>
          </div>
          <div class="col-sm-6">
            <div
              cdkDropList
              #doneList="cdkDropList"
              [cdkDropListData]="done"
              [cdkDropListConnectedTo]="[todoList]"
              class="example-list"
              (cdkDropListDropped)="dropTransfer($event)">
              <div class="example-box" *ngFor="let item of done" cdkDrag><span>{{item.order}}</span> {{item.name}}</div>
            </div>
          </div>
```

1. cdkDropList directive supports transferring dragged items between connected drop zones
2. cdkDropListData specifies for each list seperately
3. cdkDropListConnectedTo property or by wrapping the elements in an element with the cdkDropListGroup attribute
4. You can associate some arbitrary data with both cdkDrag and cdkDropList by setting cdkDragData or cdkDropListData, respectively. Events fired from both directives include this data, allowing you to easily identify the origin of the drag or drop interaction.

dropTransfer function to move the items from one list to another list.
```
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
```

Now i have to update the array to show by order properly
```
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
```

