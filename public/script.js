paypal
  .Buttons({
    createOrder: function () {
      return fetch("/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: [
            {
              id: 1,
              quantity: 1,
            },
            
          ],
        }),
      })
        .then(res => {
          if (res.ok) return res.json()
          return res.json().then(json => Promise.reject(json))
        })
        .then(({ id }) => {
          return id
        })
        .catch(e => {
          console.error(e.error)
        })
    },
    onApprove: function (data, actions) {
      return actions.order.capture().then(function(details){
        /* paymentDetails = JSON.parse(details) */
        async function sendTransactionDetails() {
          const response = await fetch("/add", {
            method: 'POST',
            headers: {
              "Content-Type":"application/json",
            },
            body: JSON.stringify({content: details, message:"Transaction details"})
          })
          const textData = await response.json()

          console.log(textData)
        }

        sendTransactionDetails()

        document.getElementById("payment-methods").classList.add("hidden");
        document.getElementById("payment-feedback").insertAdjacentHTML('beforeend', `
          <div class="alert alert-success"><i class="fa-solid fa-circle-check"></i> Payment successful!</div>
          <div class="redirect-info">
            Please wait, you will be redirected shortly...
          </div
        `);

        //Redirect user to their homepage or main page or whatever you like
        
        setTimeout(() => {
          window.location.href = "https://google.com";
        }, 2000);

      })
    },
    onCancel: function (data) {
      //window.location.replace("/on-cancel")

      document.getElementById("payment-methods").classList.add("hidden");
      document.getElementById("payment-feedback").insertAdjacentHTML('beforeend', `
        <div class="alert alert-warning"><i class="fa-solid fa-circle-exclamation"></i> Payment cancelled</div>
        <div class="redirect-info">
          Please wait, you will be redirected shortly...
        </div
      `);

      //Redirect user to their homepage or main page or whatever you like
        
      setTimeout(() => {
        window.location.href = "https://google.com";
      }, 2000);
    }
  })
  .render("#paypal")
