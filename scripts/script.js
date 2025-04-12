const fetchLevels = () => {
    try {
        fetch("https://openapi.programming-hero.com/api/levels/all")
            .then(response => response.json())
            .then(data => displayAllLevels(data.data));
    } catch (error) {
        console.log(error);
    }
}

const fetchLesson = (levelID) => {
    try {
        showLoader();
        const url = "https://openapi.programming-hero.com/api/level/" + levelID;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                removeActiveButtons();
                document.getElementById(`level-btn-${levelID}`).classList.add("active-btn");
                displayLevel(data.data)
            });
    } catch (error) {
        console.log(error);
    }
}

const fetchWord = (wordID) => {
    try {
        const url = "https://openapi.programming-hero.com/api/word/" + wordID;
        fetch(url)
            .then(response => response.json())
            .then(data => displayWord(data.data));
    } catch (error) {
        console.log(error);
    }
}

const login = () => {
    const nameInput = document.getElementById("name-input");
    const passwordInput = document.getElementById("password-input");
    console.log(typeof nameInput.value);
    console.log(typeof passwordInput.value);
    if (nameInput.value == "" && passwordInput.value == "") {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please Enter both Credentials First",
        });
        return;
    } else if (nameInput.value == "") {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please Enter both Credentials",
        });
        return;
    } else if (passwordInput.value == "") {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please Use Password: 123456",
        });
        return;
    } else {
        if (passwordInput.value == "123456") {
            Swal.fire({
                icon: "success",
                title: "Success...!!!!",
                text: "Enjoy Your Lessons......",
            });
            const navBar = document.getElementById("navbar");
            const banner = document.getElementById("banner");
            const learn = document.getElementById("learn");
            const faq = document.getElementById("faq");
            banner.classList.add("hidden");
            navBar.classList.remove("hidden");
            learn.classList.remove("hidden");
            faq.classList.remove("hidden");
        } else {
            Swal.fire({
                icon: "error",
                title: "Caution!!",
                text: "Try Again Correctly....",
            });
        }
    }
}

const showLoader = () => {
    document.getElementById("loader").classList.remove("hidden");
    document.getElementById("no-lesson-container").classList.add("hidden");
    document.getElementById("lesson").classList.add("hidden");
}

const hideLoader = () => {
    document.getElementById("loader").classList.add("hidden");
    document.getElementById("no-lesson-container").classList.remove("hidden");
    document.getElementById("lesson").classList.remove("hidden");
}

const removeActiveButtons = () => {
    const activeButtons = document.getElementsByClassName("active-btn");
    for (let activeButton of Array.from(activeButtons)) {
        activeButton.classList.remove("active-btn");
    }
}

const pronounceWord = (word) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-EN'; // English
    window.speechSynthesis.speak(utterance);
}

const displayAllLevels = (levels) => {
    const levelsContainer = document.getElementById("levels-container");
    for (let level of levels) {
        const newDIV = document.createElement("div");
        newDIV.innerHTML =
            `
        <button onclick="fetchLesson(${level.level_no})" id="level-btn-${level.level_no}" class="btn btn-outline text-primary border-2 rounded-md hover:text-white hover:bg-primary">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                <path
                    d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
            </svg>
            <span class="text-sm font-semibold">Lesson -${level.level_no}</span>
        </button>
        `;
        levelsContainer.append(newDIV);
    }
}

const displayLevel = (level) => {
    const noLessonContainer = document.getElementById("no-lesson-container");
    const lessonContainer = document.getElementById("lesson");
    lessonContainer.innerHTML = "";
    noLessonContainer.innerHTML = "";
    if (level.length == 0) {
        // noLessonContainer.classList.remove("hidden");
        noLessonContainer.innerHTML =
            `
        <img src="assets/alert-error.png" alt="No Lesson" class="mt-9">
        <h6 class="text-slate-700 text-sm">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</h6>
        <p class="text-3xl font-medium mb-9">ভিন্ন Lesson এ যান</p>
        `;
        hideLoader();
    } else {
        // noLessonContainer.classList.add("hidden");
        const limit = Math.min(9, level.length);
        for (let i = 0; i < limit; i++) {
            const newCard = document.createElement("div");
            newCard.classList.add("bg-white", "rounded-xl", "p-8", "flex", "flex-col", "justify-between", "gap-12", "hover:bg-[#f6f5ff]");
            newCard.innerHTML = `
                <div>
                <h3 class="text-2xl font-bold text-center">${level[i].word}</h3>
                <p class="text-lg font-medium mt-4 text-center">Meaning /Pronounciation</p>
                <p class="text-2xl font-semibold text-tertiary font-bangla mt-4 text-center">"${(level[i].meaning !== null) ? level[i].meaning : "অর্থ নেই"} / ${(level[i].pronunciation !== null) ? level[i].pronunciation : "উচ্চারণ নেই"}"</p>
                </div>
                <div class="flex justify-between">
                    <div onclick="fetchWord(${level[i].id})" class="p-2 rounded bg-[#1A91FF20]">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                        <path fill-rule="evenodd"
                            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                            clip-rule="evenodd" />
                        </svg>
                    </div>
                    <div onclick="pronounceWord('${level[i].word}')" class="p-2 rounded bg-[#1A91FF20]">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                        <path
                            d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" />
                        <path
                            d="M15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.06Z" />
                        </svg>
                    </div>
                </div>
            `;
            lessonContainer.append(newCard);
            hideLoader();
        }
    }
}

const displayWord = (word) => {
    console.log(word);
    document.getElementById("modal-container").showModal();
    const detailsContainer = document.getElementById("word-container");
    detailsContainer.innerHTML = `
    <h1 class="text-3xl font-semibold flex items-center">${word.word} (<span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                            <path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" />
                            <path d="M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.751 6.751 0 0 1-6 6.709v2.291h3a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1 0-1.5h3v-2.291a6.751 6.751 0 0 1-6-6.709v-1.5A.75.75 0 0 1 6 10.5Z" />
                        </svg>
                    </span> : ${word.pronunciation})</h1>
                <div class="flex flex-col gap-1">
                    <p class="text-lg font-semibold">Meaning</p>
                    <p class="font-bangla text-lg font-semibold">${(word.meaning !== null) ? word.meaning : "অর্থ পাওয়া যায়নি"}</p>
                </div>
                <div class="flex flex-col gap-1">
                    <p class="text-lg font-semibold">Example</p>
                    <p class="text-lg">${word.sentence}</p>
                </div>
                <div class="flex flex-col gap-1">
                    <p class="font-bangla text-lg font-medium">সমার্থক শব্দ গুলো</p>
                    <div id="similar-word-container-${word.id}" class="flex gap-2">
                    </div>
                </div>
                <div class="modal-action justify-start">
                    <form method="dialog">
                        <button class="btn bg-primary text-white">Complete Learning</button>
                    </form>
                </div>
    `;
    similarWordInsert(word);
}

const similarWordInsert = (word) => {
    const similarWordContainer = document.getElementById(`similar-word-container-${word.id}`);
    if (word.synonyms.length == 0) {
        const placeHolder = document.createElement("p");
        // <p class="text-lg">${word.sentence}</p>
        placeHolder.innerText = "সমার্থক শব্দ পাওয়া যায়নি";
        placeHolder.classList.add("text-base", "font-bangla", "text-slate-700");
        similarWordContainer.appendChild(placeHolder);
        return;
    }
    for (let syn of word.synonyms) {
        const newSyn = document.createElement("button");
        newSyn.innerText = syn;
        newSyn.classList.add("btn", "btn-sm", "bg-[#EDF7FF]", "text-black");
        similarWordContainer.appendChild(newSyn);
    }
}

fetchLevels();