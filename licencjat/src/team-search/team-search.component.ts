import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-team-search',
  templateUrl: './team-search.component.html',
  styleUrls: ['./team-search.component.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule]
})



export class TeamSearchComponent {
  isDropdownOpen: boolean = false;
  searchQuery: string = '';
  teammates = [
    { name: 'Anna Kowalska', avatar: 'https://s6.tvp.pl/images2/f/4/2/uid_f4242266dcc9ab138a278588e0866ddd1637159642815_width_1143_play_0_pos_0_gs_0_height_0.jpg' },
    { name: 'Jan Nowak', avatar: 'https://drlucy.pl/wp-content/uploads/pieskot.jpg' },
    { name: 'Katarzyna Lis', avatar: 'https://www.zooplus.pl/magazyn/wp-content/uploads/2023/08/Kot-i-pies-pod-jednym-dachem-768x512.jpeg' },
    { name: 'Marek Wiśniewski', avatar: 'https://tueuropa.pl/uploads/articles_files/2023/09/25/7d22a265-7a02-cbe9-63a4-000049bc5cc8.jpg' },
    { name: 'Piotr Adamski', avatar: 'https://www.monolith.pl/wp-content/uploads/2024/01/pies-i-kot-visuel-9-chien-et-chat-2024-mandarin-et-compagnie-la-station-animation-gaumont-tf1-films-production-canin-et-felin-1280x720.jpeg' }
  ];

  get filteredTeammates() {
    return this.teammates.filter(member =>
      member.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    setTimeout(() => {
      this.isDropdownOpen = false;
    }, 200);
  }
}
