class App {
   constructor() {
      // get element form search car
      this.formSearchCar = document.getElementById('searchCar');
      this.resultCar = document.getElementById('resultCar');
   }

   init() {
      const typeDriver = document.getElementById('driver');
      const date = document.getElementById('date');
      const pickupTime = document.getElementById('pickupTime');
      const totalPassenger = document.getElementById('totalPassenger');
      const submitButton = document.getElementById('cariMobil');

      typeDriver.addEventListener('change', enableSubmitButton);
      date.addEventListener('input', enableSubmitButton);
      pickupTime.addEventListener('change', enableSubmitButton);
      totalPassenger.addEventListener('input', enableSubmitButton);

      function enableSubmitButton() {
         if (typeDriver.value !== 'Pilih Tipe Driver' && date.value !== '' && pickupTime.value !== 'Pilih Waktu' && totalPassenger.value !== '') {
            submitButton.removeAttribute('disabled');
         } else {
            submitButton.setAttribute('disabled', true);
         }
      }

      this.formSearchCar.addEventListener('submit', (e) => this.filterCars(e));
   }

   async filterCars(e) {
      // menjaga page tidak ter-refresh saat button submit
      e.preventDefault();
      // set cars null
      let cars = null;
      // fetch data json
      const response = await fetch('https://raw.githubusercontent.com/fnurhidayat/probable-garbanzo/main/data/cars.min.json');
      // olah data json ke object asli
      const body = await response.json();
      // ubah availableAt menjadi unix timestamp
      cars = this.populateCars(body);
      // input tanggal
      const date = document.getElementById('date').value;
      // input jam jemput/ambil
      const pickupTime = document.getElementById('pickupTime').value;
      // ubah tanggal+jam ke unix timestamp
      const rentalDate = new Date(date + pickupTime).getTime();
      // input jumlah penumpang
      const totalPassenger = parseInt(document.getElementById('totalPassenger').value);

      // filter availableAt/Tanggal Tersedianya lebih dari Waktu Sewa.
      const availableCars = cars.filter((car) => car.availableAt > rentalDate);

      this.resultCar.innerHTML = '';

      // mencari mobil dengan kapasitas terbesar
      const maxCarCapacity = Math.max(...availableCars.map((car) => car.capacity));

      let foundCar = true;

      availableCars.forEach((car) => {
         const carElement = this.makeCars(car);

         if (car.capacity > totalPassenger) this.resultCar.append(carElement);

         if (totalPassenger > maxCarCapacity) {
            if (foundCar) {
               this.resultCar.append(`Maaf! tidak ada mobil dengan jumlah penumpang ${totalPassenger} orang`);
               foundCar = false;
            }
         }
      });
   }

   populateCars(cars) {
      return cars.map((car) => {
         return {
            ...car,
            availableAt: new Date(car.availableAt).getTime(),
         };
      });
   }
   // method format number to rupiah idr currency
   rupiah(number) {
      return new Intl.NumberFormat('id-ID', {
         style: 'currency',
         currency: 'IDR',
      }).format(number);
   }

   makeCars(car) {
      const div = document.createElement('div');
      div.classList.add('cars');
      div.classList.add('col-md-3');
      div.classList.add('shadow-lg');
      div.classList.add('p-4');
      div.classList.add('flex-grow-1');
      div.classList.add('m-3');
      div.classList.add('rounded-3');

      const img = document.createElement('img');
      img.setAttribute('src', `${car.image}`);
      img.setAttribute('width', '100%');

      const typeCar = document.createElement('h6');
      typeCar.classList.add('mt-4');
      typeCar.innerText = `${car.type}`;

      const rentalPerDay = document.createElement('h5');
      rentalPerDay.classList.add('my-3');
      const price = `${car.rentPerDay}`;
      rentalPerDay.innerText = `${this.rupiah(price)} / hari`;

      const description = document.createElement('p');
      description.innerText = `${car.description}`;

      const capacity = document.createElement('p');
      capacity.innerHTML = `<i class='fa-solid fa-user-group'></i> ${car.capacity} orang`;

      const transmission = document.createElement('p');
      transmission.innerHTML = `<i class='fa-solid fa-gear'></i> ${car.transmission}`;

      const year = document.createElement('p');
      year.innerHTML = `<i class='fa-solid fa-calendar'></i> Tahun ${car.year}`;

      const button = document.createElement('button');
      button.classList.add('btn');
      button.classList.add('btn-success');
      button.classList.add('mt-3');
      button.classList.add('p-3');
      button.classList.add('fw-bold');
      button.style.width = '100%';
      button.innerText = 'Pilih Mobil';

      div.append(img, typeCar, rentalPerDay, description, capacity, transmission, year, button);

      return div;
   }
}

const app = new App();
app.init();
