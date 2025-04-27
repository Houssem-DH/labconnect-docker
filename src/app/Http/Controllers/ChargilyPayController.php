<?php

namespace App\Http\Controllers;

use App\Models\ChargilyPayment;
use App\Models\Material_reservation;
use Chargily\ChargilyPay\Auth\Credentials;
use Chargily\ChargilyPay\ChargilyPay;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class ChargilyPayController extends Controller
{


    protected function chargilyPayInstance()
    {
        return new ChargilyPay(new Credentials([
            "mode" => env('CHARGILY_MODE', 'test'),
            "public" => env('CHARGILY_PUBLIC_KEY'),
            "secret" => env('CHARGILY_SECRET_KEY'),
        ]));
    }
    public function redirect(ChargilyPayment $payment)
    {
        if ($payment->user_id !== auth()->id())
            abort(403);

        $checkout = $this->chargilyPayInstance()->checkouts()->create([
            "metadata" => ["payment_id" => $payment->id],
            "locale" => "ar",
            "amount" => $payment->amount,
            "currency" => $payment->currency,
            "description" => "Payment for Reservation #{$payment->material_reservation_id}",
            "success_url" => route("chargilypay.back"),
            "failure_url" => route("chargilypay.back"),
            "webhook_endpoint" => route("chargilypay.webhook_endpoint"),
        ]);

        return $checkout ? Inertia::location($checkout->getUrl()) : redirect()->back()->with('error', 'Payment failed');
    }
    /**
     * Your client you will redirected to this link after payment is completed ,failed or canceled
     *
     */
    public function back(Request $request)
    {
        // Retrieve the checkout ID from the request (if provided by Chargily redirect)
        $checkout_id = $request->input("checkout_id");
        $payment = null;

        // Default status and message in case the payment record is not found
        $status = 'unknown';
        $message = 'Thank you for completing the payment process!';

        // If there is a checkout id, retrieve the checkout details for reference only
        if ($checkout_id) {
            $checkout = $this->chargilyPayInstance()->checkouts()->get($checkout_id);

            if ($checkout) {
                $metadata = $checkout->getMetadata();
                // Retrieve the local payment record by using the payment id stored in metadata.
                $payment = ChargilyPayment::find($metadata['payment_id'] ?? null);
            }
        }

        // Optionally, you can also get payment directly from a query parameter:
        if (!$payment && $request->has('payment_id')) {
            $payment = ChargilyPayment::find($request->query('payment_id'));
        }

        // If the payment record exists, use its status to determine the display message.
        if ($payment) {
            $status = $payment->status;

            // Customize messages based on status.
            $messages = [
                'paid' => 'Payment completed successfully!',
                'failed' => 'Payment failed. Please try again.',
                'canceled' => 'Payment was canceled.',
                // Add other statuses as necessary.
            ];

            $message = $messages[$status] ?? $message;

            return Inertia::render('Payments/Status', [
                'status' => $status,
                'payment' => $payment ,
                'canLogin' => Route::has('login'),
                'canRegister' => Route::has('register'),
            ]);
        } else {
            return Redirect::route('home')->with('message', 'Payment record not found.');
        }

        // Render the payment status page without processing anything.

    }

    /**
     * This action will be processed in the background
     */
    public function webhook()
    {
        $webhook = $this->chargilyPayInstance()->webhook()->get();

        if ($webhook && $checkout = $webhook->getData()) {
            $payment = ChargilyPayment::find($checkout->getMetadata()['payment_id']);
            $reservation = Material_reservation::find($payment->material_reservation_id);

            if ($checkout->getStatus() === "paid") {
                // Update payment and reservation
                $payment->update(['status' => 'paid']);
                $reservation->update(['status' => 'pending_approval']);

                // Create notifications
                $this->createNotifications($reservation);

            } elseif (in_array($checkout->getStatus(), ["failed", "canceled"])) {
                $payment->update(['status' => 'failed']);
                $reservation->update(['status' => 'payment_failed']);
            }
        }

        return response()->json(['status' => true]);
    }

    /**
     * Just a shortcut
     */

}
