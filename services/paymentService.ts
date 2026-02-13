declare const Razorpay: any;

export const paymentService = {
  initializePayment: (options: {
    amount: number;
    email: string;
    userName: string;
    onSuccess: (response: any) => void;
    onDismiss?: () => void;
  }) => {
    const keyId = process.env.RAZORPAY_KEY_ID;

    if (!keyId) {
      alert("Payment system is not configured. Please add RAZORPAY_KEY_ID to your environment.");
      return;
    }

    const rzpOptions = {
      key: keyId,
      amount: options.amount * 100, // Razorpay works in paise
      currency: "INR",
      name: "ResuMaster AI",
      description: "Pro Membership Subscription",
      image: "https://cdn-icons-png.flaticon.com/512/3135/3135673.png",
      handler: function(response: any) {
        options.onSuccess(response);
      },
      prefill: {
        name: options.userName,
        email: options.email
      },
      notes: {
        address: "ResuMaster AI Headquarters"
      },
      theme: {
        color: "#2563eb"
      },
      modal: {
        ondismiss: function() {
          if (options.onDismiss) options.onDismiss();
        }
      }
    };

    try {
      const rzp = new Razorpay(rzpOptions);
      rzp.open();
    } catch (err) {
      console.error("Razorpay error:", err);
      alert("Failed to initialize payment gateway.");
    }
  }
};