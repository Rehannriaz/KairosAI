import axios from 'axios';
const cheerio = require('cheerio');
export async function getJobDetails(url:string) {
    try {
      const response = await axios.get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
          "Accept-Encoding": "gzip, deflate, br",
          Connection: "keep-alive",
        },
        timeout: 5000,
      });
  
      const $ = cheerio.load(response.data);
  
      // Extract job description content
      const fullDescription:any = $(".show-more-less-html__markup").html();
  
      // Try to separate requirements and role description
      // This is a basic approach - you might need to adjust based on the actual content structure
      let aboutRole = "";
      let requirements = "";
  
      const descriptionText = $(".show-more-less-html__markup")
        .text()
        .toLowerCase();
  
      // Look for common section indicators
      const requirementIndicators = [
        "requirements",
        "qualifications",
        "what you'll need",
        "what we're looking for",
        "required skills",
        "minimum qualifications",
      ];
  
      const roleIndicators = [
        "about the role",
        "role description",
        "job description",
        "what you'll do",
        "responsibilities",
        "about this role",
      ];
  
      // Find the positions of different sections
      let requirementStart = -1;
      for (let indicator of requirementIndicators) {
        const pos = descriptionText.indexOf(indicator);
        if (pos !== -1) {
          requirementStart = pos;
          break;
        }
      }
  
      let roleStart = -1;
      for (let indicator of roleIndicators) {
        const pos = descriptionText.indexOf(indicator);
        if (pos !== -1) {
          roleStart = pos;
          break;
        }
      }
  
      // Extract sections based on found positions
      if (roleStart !== -1 && requirementStart !== -1) {
        if (roleStart < requirementStart) {
          aboutRole = fullDescription.slice(roleStart, requirementStart).trim();
          requirements = fullDescription.slice(requirementStart).trim();
        } else {
          requirements = fullDescription
            .slice(requirementStart, roleStart)
            .trim();
          aboutRole = fullDescription.slice(roleStart).trim();
        }
      } else {
        // If we can't clearly separate sections, include full description in aboutRole
        aboutRole = fullDescription;
      }
  
      return {
        aboutRole: aboutRole || "Not specified",
        requirements: requirements || "Not specified",
        fullDescription: fullDescription || "Not specified",
      };
    } catch (error:any) {
      console.error(`Error fetching job details for ${url}:`, error.message);
      return {
        aboutRole: "Failed to fetch",
        requirements: "Failed to fetch",
        fullDescription: "Failed to fetch",
      };
    }
  }