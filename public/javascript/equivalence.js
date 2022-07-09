function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

var results = [];

document
  .getElementById("submitResults")
  .addEventListener('click', function () {
    fetch(`/update-profile/${getCookie('userName')}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({classes: results})
    }).then(res => window.location.replace(`http://localhost:3000/profile/${getCookie(userName)}`));
  })

document
  .getElementById('upload')
  .addEventListener('click', () => {
    document
      .getElementById("upload")
      .innerHTML = `
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Uploading
      `
    document
      .getElementById("upload")
      .setAttribute("disabled", "true")


    let file = document.getElementById("formFile");

    const formData = new FormData();
    formData.append('doc', file.files[0]);


    fetch('/equivalence-results', {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(res => {
        console.log(res);
        return res;
      })
      .then(res => {
        //console.log(res);
        let localres = [...res.classes];
        results = [...res.classes];
        document
          .getElementById("upload")
          .innerHTML = `Results Evaluated!`

        let tokenString = '';
        tokenString += `
          <h4 class="mt-3">Major Skill Acquired</h4>
          <p>This is the major skill you have learned in this course.
          <div class="card border-info mb-2 mt-1">
              <div class="card-header">Major Token Unlocked</div>
                <div class="card-body text-info">
                <h5 class="card-title">${res.classes[0]} x1</h5>
              </div>
          </div>
          <br>
          <h5>Other Skills Acquired</h5>
          <p>These are the side skills which you may have acquired along with the major skill.</p>
        `
        localres.shift();

        tokenString += localres.map((elem) => `
            <div class="card border-info mb-2 mt-1" style="margin-left:100px;margin-right:100px">
              <div class="card-header">Side Token Unlocked</div>
                <div class="card-body text-info">
                <h5 class="card-title">${elem} x0.5</h5>
              </div>
            </div>
        `)
        document.getElementById("tokens").innerHTML = tokenString

        document.getElementById("submitResults").removeAttribute("hidden");

      });
  })

