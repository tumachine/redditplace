result = document.getElementById('result');

function register() {
  fetch('http://localhost:8080/auth/register', {
    credentials: 'same-origin',
    mode: 'same-origin',
    method: 'POST',
    body: getData(),
  })
      .then((resp) => {
        if (resp.status==200) {
          result.innerHTML = 'Register success';
        }
      });
};

function login() {
  fetch('http://localhost:8080/auth/login', {
    credentials: 'same-origin',
    mode: 'same-origin',
    method: 'POST',
    body: getData(),
  })
      .then((resp) => {
        if (resp.status==200) {
          result.innerHTML = 'Login success';
        }
      });
};

const handleSubmit = async () => {
  const email = document.getElementById('email');
  const password = document.getElementById('password');

  const res = await fetch(`http://localhost:8080/auth/login`, {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => res.json());

  const {token, success, msg, user} = res;

  if (!success) {
    return setState({
      ...state,
      message: msg,
      isSubmitting: false,
    });
  }
  // expire in 30 minutes(same time as the cookie is invalidated on the backend)
  // create jwt
};
