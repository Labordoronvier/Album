new Vue({
  el: '#app',
  data: {
    isOpenedTop: false,
    items: [
      {
        title: 'Page 1',
        images: [
          'coffee date1.jpg',
          'coffee date2.jpg',
          'coffee date3.jpg',
          '1.jpg'
        ],
        isOpen: false
      },
      {
        title: 'Page 2',
        images: [
          '2.jpg',
          '3.jpg',
          '4.jpg',
          '5.jpg'
        ],
        isOpen: false
      },
      {
        title: 'Page 3',
        images: [
          '6.jpg',
          '7.jpg',
          '8.jpg',
          '9.jpg'
        ],
        isOpen: false
      },
      {
        title: 'Page 4',
        images: [
          '10.jpg',
          '11.jpg',
          '12.jpg',
          '13.jpg'
        ],
        isOpen: false
      },
      {
        title: 'Page 5',
        images: [
          '14.jpg',
          '15.jpg',
          '16.jpg',
          '17.jpg'
        ],
        isOpen: false
      },
      {
        title: 'Page 6',
        images: [
          '18.jpg',
          '3.jpg',
          '4.jpg',
          '5.jpg'
        ],
        isOpen: false
      },
    ]
  },
  methods: {
    topOpen(state) {
      this.isOpenedTop = !state;
    },
    open(index, state) {
      this.items[index].isOpen = !state;
    },
    reset() {
      this.items.forEach(item => (item.isOpen = false));
      this.isOpenedTop = false;
    }
  }
});