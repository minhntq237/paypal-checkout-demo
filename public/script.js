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
        /* window.location.replace("/on-success") */

        async function sendTransactionDetails() {
          const response = await fetch("https://paypal-checkout-demo-k2rpp.ondigitalocean.app//add", {
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
      })
    },
    onCancel: function (data) {
      window.location.replace("/on-cancel")
    }
  })
  .render("#paypal")
