import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateDocument(req: {
  prompt: string;
  template: string;
  contractType?: string;
  agreementType?: string;
  willType?: string;
  affidavitType?: string;
}) {
  // Ensure the API key is set in your environment variables
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);

  try {
    const {
      prompt: userPrompt,
      template,
      contractType,
      agreementType,
      willType,
      affidavitType,
    } = req;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    let prompt = "";

    if (template === "Contract") {
      switch (contractType) {
        case "NDA":
          prompt = `Draft a comprehensive Non-Disclosure Agreement (NDA) in markdown format. Do not import any external libraries. The agreement should be based on the following details: ${userPrompt}. 

Include essential clauses such as:
1. Confidential Information: Define the scope of confidentiality.
2. Exclusions from Confidentiality: Outline what is not covered.
3. Obligations of the Receiving Party: Specify the responsibilities of the party receiving the information.
4. Term and Termination: Define the duration of the agreement.
5. Breach and Remedies: Include consequences for breaches.
6. Governing Law: Specify the legal jurisdiction.

Ensure the output is valid markdown and does not require importing any external libraries. Leave placeholders for unknown values, represented with underlines.`;
          break;
        case "Employment":
          prompt = `Draft a legally sound Employment Agreement in markdown format. Do not import any external libraries. The agreement should be based on the following details: ${userPrompt}. 

Include key clauses such as:
1. Position and Job Title: Specify the employee's role.
2. Compensation: Outline salary, bonuses, and benefits.
3. Duties and Responsibilities: Clearly define expectations.
4. Confidentiality and Non-Compete: Protect employer information.
5. Termination Conditions: Describe notice period and grounds for termination.
6. Governing Law: Specify applicable laws.

Ensure the output is valid markdown and does not require importing any external libraries. Leave placeholders for unknown values, represented with underlines.`;
          break;
        case "Sales":
          prompt = `Draft a detailed Sales Agreement in markdown format. Do not import any external libraries. The agreement should be based on the following details: ${userPrompt}. 

Ensure the inclusion of:
1. Description of Goods/Services: Define the items being sold.
2. Payment Terms: Outline payment schedules and methods.
3. Delivery Details: Specify timelines and shipping terms.
4. Risk of Loss: State when responsibility transfers.
5. Warranties and Representations: Define guarantees and disclaimers.
6. Governing Law: Specify the jurisdiction.

Ensure the output is valid markdown and does not require importing any external libraries. Leave placeholders for unknown values, represented with underlines.`;
          break;
        default:
          prompt = `Draft a legal contract template for a ${contractType} in markdown format based on the following details: ${userPrompt}. Include all relevant clauses and represent unknown values with underlines. Ensure the output is valid markdown and does not require importing any external libraries.`;
      }
    } else if (template === "Agreement") {
      switch (agreementType) {
        case "Partnership":
          prompt = `Draft a detailed Partnership Agreement in markdown format based on the following details: ${userPrompt}. Do not import any external libraries.

Ensure the agreement includes:
1. Partnership Purpose: State the reason for the partnership.
2. Capital Contributions: Detail contributions of each partner.
3. Profit and Loss Distribution: Define the sharing ratios.
4. Management and Decision-Making: Explain governance procedures.
5. Withdrawal and Dissolution: Include exit strategies and dissolution terms.
6. Dispute Resolution: Specify arbitration or mediation methods.
7. Governing Law: Reference relevant legal statutes.

Ensure the output is valid markdown and does not require importing any external libraries. Leave placeholders for unknown values, represented with underlines.`;
          break;
        case "Service":
          prompt = `Draft a clear and concise Service Agreement in markdown format based on the following details: ${userPrompt}. Do not import any external libraries.

Include clauses such as:
1. Scope of Services: Clearly define the services to be provided.
2. Compensation: Specify payment terms and amounts.
3. Term and Termination: Define the agreement duration.
4. Confidentiality: Protect sensitive information.
5. Liability and Indemnification: Outline responsibilities and limitations.
6. Governing Law: Specify applicable jurisdiction.

Ensure the output is valid markdown and does not require importing any external libraries. Leave placeholders for unknown values, represented with underlines.`;
          break;
        case "Lease":
          prompt = `Draft a detailed Lease Agreement in markdown format based on the following details: ${userPrompt}. Do not import any external libraries.

Include key elements such as:
1. Lease Term: Define the duration of the lease.
2. Rent Payment: Specify the amount, due dates, and penalties.
3. Security Deposit: Outline the terms for deposits.
4. Responsibilities: Clarify maintenance and repair obligations.
5. Termination Conditions: State grounds for early termination.
6. Governing Law: Specify the jurisdiction.

Ensure the output is valid markdown and does not require importing any external libraries. Leave placeholders for unknown values, represented with underlines.`;
          break;
        default:
          prompt = `Draft a legal agreement template for a ${agreementType} in markdown format based on the following details: ${userPrompt}. Include all relevant clauses and leave unknown values blank with underlines. Ensure the output is valid markdown and does not require importing any external libraries.`;
      }
    } else if (template === "Will") {
      switch (willType) {
        case "Unprivileged":
          prompt = `Draft a legally compliant Unprivileged Will in markdown format based on the following details: ${userPrompt}. Do not import any external libraries.

Include sections such as:
1. Declaration: State the testator's intent.
2. Assets and Beneficiaries: Specify who inherits what.
3. Executor Appointment: Designate a trusted executor.
4. Signatures and Witnesses: Ensure compliance with legal requirements.

Ensure the output is valid markdown and does not require importing any external libraries. Leave placeholders for unknown values, represented with underlines.`;
          break;
        case "Privileged":
        case "Conditional":
        case "Joint":
        case "Mutual":
          prompt = `Draft a legally compliant ${willType} Will in markdown format based on the following details: ${userPrompt}. Do not import any external libraries.

Include sections such as:
1. Declaration: State the testator's intent.
2. Assets and Beneficiaries: Specify who inherits what.
3. Executor Appointment: Designate a trusted executor.
4. Special Clauses: Add relevant conditions for the type of will.
5. Signatures and Witnesses: Ensure compliance with legal requirements.

Ensure the output is valid markdown and does not require importing any external libraries. Leave placeholders for unknown values, represented with underlines.`;
          break;
        default:
          prompt = `Draft a ${willType} Will in markdown format based on the following details: ${userPrompt}. Include all necessary sections and leave unknown values blank with underlines. Ensure the output is valid markdown and does not require importing any external libraries.`;
      }
    } else if (template === "Affidavit") {
      switch (affidavitType) {
        case "General":
          prompt = `Draft a General Affidavit in markdown format based on the following details: ${userPrompt}. Do not import any external libraries.
  
  Include sections such as:
  1. Affiant's Details: Name, address, and identification of the affiant.
  2. Statement of Facts: A clear and concise statement of the facts being affirmed.
  3. Sworn Declaration: A statement affirming the truthfulness of the information provided.
  4. Signature and Notary: Provide space for the affiant's signature and a notary's acknowledgment.
  
  Ensure the output is valid markdown and does not require importing any external libraries. Leave placeholders for unknown values, represented with underlines.`;
          break;
        case "Financial":
          prompt = `Draft a Financial Affidavit in markdown format based on the following details: ${userPrompt}. Do not import any external libraries.
  
  Include sections such as:
  1. Affiant's Financial Information: Income, assets, liabilities, and expenses.
  2. Statement of Assets: List the affiant's personal and business assets.
  3. Statement of Liabilities: Outline any liabilities or debts.
  4. Statement of Income: Include income details such as salary, business income, etc.
  5. Certification: Statement confirming that the information provided is true and accurate.
  
  Ensure the output is valid markdown and does not require importing any external libraries. Leave placeholders for unknown values, represented with underlines.`;
          break;
        case "Identity":
          prompt = `Draft an Affidavit of Identity in markdown format based on the following details: ${userPrompt}. Do not import any external libraries.
  
  Include sections such as:
  1. Affiant's Identity: Full name, date of birth, and identifying documents (passport, driver's license, etc.).
  2. Statement of Identification: Affirm the identity of the affiant.
  3. Verification by Third Party: If applicable, include a statement from a witness or third-party verifying the identity.
  4. Signature and Notary: Provide space for the affiant's signature and a notary's acknowledgment.
  
  Ensure the output is valid markdown and does not require importing any external libraries. Leave placeholders for unknown values, represented with underlines.`;
          break;
        case "Residence":
          prompt = `Draft an Affidavit of Residence in markdown format based on the following details: ${userPrompt}. Do not import any external libraries.
  
  Include sections such as:
  1. Affiant's Details: Name, address, and identification of the affiant.
  2. Statement of Residence: Declare the affiant's current residence and provide supporting evidence (utility bills, lease agreement, etc.).
  3. Witness Statement: If required, include a statement from a witness affirming the residence.
  4. Signature and Notary: Provide space for the affiant's signature and a notary's acknowledgment.
  
  Ensure the output is valid markdown and does not require importing any external libraries. Leave placeholders for unknown values, represented with underlines.`;
          break;
        case "Marriage":
          prompt = `Draft an Affidavit of Marriage in markdown format based on the following details: ${userPrompt}. Do not import any external libraries.
  
  Include sections such as:
  1. Affiant's Details: Full name, date of birth, and identification of the affiant.
  2. Marriage Details: Provide details of the marriage, including date and place.
  3. Affiant's Statement: Affirm the marital status of the affiant.
  4. Supporting Documents: List any supporting documents (marriage certificate, etc.).
  5. Signature and Notary: Provide space for the affiant's signature and a notary's acknowledgment.
  
  Ensure the output is valid markdown and does not require importing any external libraries. Leave placeholders for unknown values, represented with underlines.`;
          break;
        case "NameChange":
          prompt = `Draft an Affidavit of Name Change in markdown format based on the following details: ${userPrompt}. Do not import any external libraries.
  
  Include sections such as:
  1. Affiant's Details: Full name, date of birth, and identification of the affiant.
  2. Previous Name: State the previous name of the affiant.
  3. New Name: State the new name of the affiant.
  4. Reason for Name Change: Describe the reason for the name change (marriage, personal choice, etc.).
  5. Signature and Notary: Provide space for the affiant's signature and a notary's acknowledgment.
  
  Ensure the output is valid markdown and does not require importing any external libraries. Leave placeholders for unknown values, represented with underlines.`;
          break;
        default:
          prompt = `Draft an affidavit for a ${affidavitType} in markdown format based on the following details: ${userPrompt}. Include all relevant sections and leave unknown values blank with underlines. Ensure the output is valid markdown and does not require importing any external libraries.`;
      }
    } else {
      prompt = `Draft a legal document template for ${template} in markdown format based on the following details: ${userPrompt}. Include all relevant sections and leave unknown values blank with underlines. Ensure the output is valid markdown and does not require importing any external libraries.`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const code = await response.text();

    return { code };
  } catch (error) {
    console.error(error);
    throw new Error("Error generating document");
  }
}