import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { PollService } from '../poll.service';
import { Poll } from '../poll.models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { errorContext } from 'rxjs/internal/util/errorContext';


@Component({
  selector: 'app-poll',
  imports: [CommonModule, FormsModule],
  templateUrl: './poll.component.html',
  styleUrl: './poll.component.css',
})
export class PollComponent implements OnInit{

  newPoll: Poll = {
    // id: 0,
    question: '',
    options: [
      {optionText: '', voteCount: 0},
      {optionText: '', voteCount: 0}
    ]
  };

  polls: WritableSignal<Poll[]> = signal<Poll[]>([]);

  constructor(private pollService: PollService) {
  }

  ngOnInit(): void {
    this.loadPolls();
  }

  loadPolls() {
    this.pollService.getPolls().subscribe({
      next: (data) => {
        // this.polls = data;
        this.polls.set(data);
      },
      error: (error) => {
        console.error("Error fetching polls: ", error);
      }
    });
  }

  createPoll() {
    this.pollService.createPoll(this.newPoll).subscribe({
      next: (createdPoll) => {
        this.polls.update(polls => [...polls, createdPoll]);
        this.resetPoll();
      },
      error: (error) => {
        console.error("Error creating polls: ", error);
      }
    });
  }
  
  resetPoll() {
    this.newPoll = {
    // id: 0,
      question: '',
      options: [
        {optionText: '', voteCount: 0},
        {optionText: '', voteCount: 0}
      ]
    };
  }

  vote(pollId: number, optionIndex: number) {
    this.pollService.vote(pollId, optionIndex).subscribe ({
      next: () => {
        const polls = this.polls();        // get array from signal
        const poll = polls.find(p => p.id === pollId);
        if (poll) {
          poll.options[optionIndex].voteCount++;
          this.polls.set([...polls]); 
        }
      },
      error: (error) => {
        console.error("Error voting polls: ", error);
      }
    });
  }

  addOption() {
    this.newPoll.options.push({ optionText: '', voteCount: 0 });
  }

  // trackByIndex(index: number): number {
  //   return index;
  // }
}
