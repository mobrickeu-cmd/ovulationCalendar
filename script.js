document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('calculatorForm');
    const date1Input = document.getElementById('date1');
    const date2Input = document.getElementById('date2');
    const errorMsg = document.getElementById('errorMsg');
    const resultContainer = document.getElementById('resultContainer');

    // Inițializare Flatpickr în limba română
    const flatpickrConfig = {
        locale: "ro",
        dateFormat: "Y-m-d", // Formatul folosit în logica js curentă
        altInput: true,
        altFormat: "j F Y", // Cum va fi afișat pentru utilizator (ex: 1 Ianuarie 2026)
        allowInput: true
    };

    flatpickr(date1Input, flatpickrConfig);
    flatpickr(date2Input, flatpickrConfig);

    const resLength = document.getElementById('resLength');
    const resDay = document.getElementById('resDay');
    const resDate = document.getElementById('resDate');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Ascundem erorile și rezultatul la fiecare nouă încercare
        hideError();
        resultContainer.classList.remove('show');

        // Preluăm valorile și creăm obiecte Date
        const date1 = new Date(date1Input.value);
        const date2 = new Date(date2Input.value);

        if (isNaN(date1) || isNaN(date2)) {
            showError("Te rugăm să introduci date calendaristice valide în ambele câmpuri.");
            return;
        }

        // Calculăm diferența în milisecunde și o transformăm în zile
        const diffTime = date2.getTime() - date1.getTime();
        const cycleLength = Math.round(diffTime / (1000 * 60 * 60 * 24));

        // Validări pe lungimea ciclului
        if (cycleLength <= 0) {
            showError("A doua dată trebuie să fie neapărat după prima dată.");
            return;
        }

        if (cycleLength > 60 || cycleLength < 15) {
            showError(`Atenție: Ciclul rezultat are ${cycleLength} zile. Formula standard este recomandată pentru cicluri între 15 și 60 de zile. Vă rugăm să verificați datele introduse.`);
            return;
        }

        // Calculăm ziua ovulației scăzând 14 zile din lungimea ciclului
        const ovulationDay = cycleLength - 14;

        if (ovulationDay <= 0) {
            showError("Ciclul calculat este prea scurt pentru a stabili ovulația prin formula standard.");
            return;
        }

        // Calculăm data calendaristică estimată (ziua 1 = date2)
        const ovulationDateObj = new Date(date2);
        ovulationDateObj.setDate(ovulationDateObj.getDate() + ovulationDay - 1);

        // Formatăm data estetic în limba română
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = ovulationDateObj.toLocaleDateString('ro-RO', options);

        // Populăm containerul de rezultate
        resLength.innerHTML = `Ai un ciclu calculat de <strong>${cycleLength} zile</strong>.`;
        resDay.innerHTML = `Ovulația ta are loc în <strong>ziua ${ovulationDay}</strong> a ciclului tău actual.`;
        resDate.innerHTML = `<strong>${formattedDate}</strong>`;

        // Afișăm containerul cu rezultate folosind o scurtă întârziere pentru a permite animației să ruleze
        setTimeout(() => {
            resultContainer.classList.add('show');
        }, 80);
    });

    function showError(msg) {
        errorMsg.textContent = msg;
        errorMsg.style.display = 'block';
    }

    function hideError() {
        errorMsg.style.display = 'none';
        errorMsg.textContent = '';
    }
});
